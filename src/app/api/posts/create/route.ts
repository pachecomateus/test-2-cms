import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, content, image } = await request.json();
    
    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Title, description, and content are required' }, { status: 400 });
    }

    const post = createPost(title, description, content, image);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
