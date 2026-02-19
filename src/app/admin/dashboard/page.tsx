'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Post } from '@/lib/db';

// Dynamic import for markdown editor to avoid SSR issues
const MDEditor = dynamic(
  async () => {
    const { default: MDEditor } = await import('@uiw/react-md-editor');
    return MDEditor;
  },
  { ssr: false, loading: () => <div className="w-full h-64 bg-gray-100 rounded-lg" /> }
);

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (editingId) {
        const response = await fetch('/api/posts/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, title, description, content, image: image || undefined }),
        });

        if (!response.ok) throw new Error('Failed to update');
        setMessage('Post atualizado com sucesso');
      } else {
        const response = await fetch('/api/posts/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, content, image: image || undefined }),
        });

        if (!response.ok) throw new Error('Failed to create');
        setMessage('Post criado com sucesso');
      }

      setTitle('');
      setDescription('');
      setContent('');
      setImage('');
      setEditingId(null);
      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setDescription(post.description || '');
    setContent(post.content);
    setImage(post.image || '');
    setEditingId(post.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza de que deseja deletar este post?')) return;

    try {
      const response = await fetch('/api/posts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete');
      setMessage('Post deletado com sucesso');
      await fetchPosts();
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block">
                ← Voltar para home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie seus posts de blog</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.startsWith('Error')
                ? 'bg-red-100 border-red-400 text-red-700'
                : 'bg-green-100 border-green-400 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form Section */}
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setTitle('');
                setDescription('');
                setContent('');
                setImage('');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Novo Post
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-300">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {editingId ? 'Editar Post' : 'Criar Novo Post'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-2">
                    Título do Post *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do seu post"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900 placeholder-gray-500"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
                    Descrição *
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breve resumo do post"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900 placeholder-gray-500"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-bold text-gray-900 mb-2">
                    Imagem Destacada
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900"
                    disabled={submitting}
                  />
                  {image && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">Visualização da Imagem:</p>
                      <img src={image} alt="Preview" className="max-h-48 rounded-lg border-2 border-gray-300" />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-bold text-gray-900 mb-2">
                    Conteúdo (Markdown) *
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Formato: **negrito**, *itálico*, # Títulos, - Listas, [links](url)</p>
                  <div data-color-mode="light" className="rounded-lg overflow-hidden border-2 border-gray-400 bg-white">
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      preview="edit"
                      hideToolbar={submitting}
                      height={300}
                      visibleDragbar={false}
                      textareaProps={{
                        disabled: submitting,
                      }}
                      className="!border-0 !rounded-0"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Salvando...' : editingId ? 'Atualizar Post' : 'Publicar Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setTitle('');
                      setDescription('');
                      setContent('');
                      setImage('');
                    }}
                    className="px-8 py-3 border-2 border-gray-400 text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Posts List */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Posts Publicados</h2>
          {loading ? (
            <p className="text-gray-500">Carregando posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">Nenhum post ainda. Crie um para começar!</p>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200 flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    {post.image && (
                      <img src={post.image} alt={post.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                    )}
                    <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                    <p className="text-gray-600 mt-1">{post.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Atualizado: {new Date(post.updatedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors whitespace-nowrap"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
