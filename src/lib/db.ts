import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'blog.db');

let db: Database.Database;

export function getDb() {
  if (!db) {
    // Create data directory if it doesn't exist
    const fs = require('fs');
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDb();
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
  const db = getDb();
  return db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all() as Post[];
}

export function getPostById(id: number): Post | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
}

export function createPost(title: string, description: string, content: string, image?: string): Post {
  const db = getDb();
  const result = db.prepare('INSERT INTO posts (title, description, content, image) VALUES (?, ?, ?, ?)').run(title, description, content, image || null);
  return getPostById(result.lastInsertRowid as number)!;
}

export function updatePost(id: number, title: string, description: string, content: string, image?: string): Post {
  const db = getDb();
  db.prepare('UPDATE posts SET title = ?, description = ?, content = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(
    title,
    description,
    content,
    image || null,
    id
  );
  return getPostById(id)!;
}

export function deletePost(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}
