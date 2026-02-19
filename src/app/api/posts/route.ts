import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/db';

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
