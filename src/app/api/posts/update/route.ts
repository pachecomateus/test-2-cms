import { NextRequest, NextResponse } from 'next/server';
import { updatePost } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, description, content, image } = await request.json();
    
    if (!id || !title || !description || !content) {
      return NextResponse.json({ error: 'ID, title, description, and content are required' }, { status: 400 });
    }

    const post = updatePost(id, title, description, content, image);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
