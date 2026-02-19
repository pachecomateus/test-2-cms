import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'blog.db');

let db: Database.Database;

export function getDb() {
  if (!db) {
    try {
      // Create data directory if it doesn't exist
      const fs = require('fs');
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      db = new Database(dbPath);
      db.pragma('journal_mode = WAL');
      initializeDb();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  return db;
}

function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export interface Post {
  id: number;
  title: string;
  description?: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export function getAllPosts(): Post[] {
  try {
    const db = getDb();
    return db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all() as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export function getPostById(id: number): Post | undefined {
  try {
    const db = getDb();
    return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
  } catch (error) {
    console.error('Error fetching post:', error);
    return undefined;
  }
}

export function createPost(title: string, description: string, content: string, image?: string): Post {
  try {
    const db = getDb();
    const result = db.prepare('INSERT INTO posts (title, description, content, image) VALUES (?, ?, ?, ?)').run(title, description, content, image || null);
    return getPostById(result.lastInsertRowid as number)!;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export function updatePost(id: number, title: string, description: string, content: string, image?: string): Post {
  try {
    const db = getDb();
    db.prepare('UPDATE posts SET title = ?, description = ?, content = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(
      title,
      description,
      content,
      image || null,
      id
    );
    return getPostById(id)!;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export function deletePost(id: number): boolean {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}
