# Blog CMS

A simple Next.js blog CMS system with authentication and post management.

## Features

- **Public Home Page**: View all published blog posts
- **Admin Login**: Secure login with default credentials (username: `admin`, password: `password`)
- **Admin Dashboard**: Create, edit, and delete blog posts
- **SQLite Database**: Persistent storage for posts
- **Session-based Authentication**: Cookie-based secure authentication

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Running in Production

```bash
npm run build
npm run start
```

## Using the Application

### Home Page
- Access at `http://localhost:3000`
- View all blog posts
- Click "Admin" to go to login

### Admin Panel
- Access at `http://localhost:3000/admin/login`
- Login with:
  - **Username**: `admin`
  - **Password**: `password`
- Create, edit, and delete posts from the dashboard

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── admin/
│   │   ├── login/page.tsx        # Login page
│   │   └── dashboard/page.tsx    # Admin dashboard
│   └── api/                      # API routes
│       ├── posts/                # Post management endpoints
│       └── auth/                 # Authentication endpoints
└── lib/
    ├── auth.ts                   # Authentication logic
    ├── db.ts                     # Database operations
    └── auth-context.tsx          # Auth context provider
```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts/create` - Create a post
- `PUT /api/posts/update` - Update a post
- `DELETE /api/posts/delete` - Delete a post

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check authentication status

## Default Configuration

| Setting | Value |
|---------|-------|
| Default Username | `admin` |
| Default Password | `password` |
| Database | SQLite (data/blog.db) |
| Port | 3000 (or next available) |

⚠️ **Important**: Change the default credentials and session secret before deploying to production!

## Database

The application uses SQLite with the following schema:

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

The database file is stored at `data/blog.db` and is created automatically on first run.

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **SQLite** - Database
- **better-sqlite3** - SQLite driver

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run ESLint
npm run lint
```

## Troubleshooting

### Database corruption
Delete `data/blog.db` and restart the server to reset the database.

### Port already in use
If port 3000 is in use, the server will automatically use the next available port.

### Authentication issues
- Ensure cookies are enabled in your browser
- Try clearing browser cookies and logging in again
- Check that you're using the correct credentials

## License

MIT
