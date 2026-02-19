# Blog CMS Project

## Project Overview
A simple Next.js blog CMS system with authentication and post management.

### Features
- **Public Home Page**: View all published blog posts
- **Admin Login**: Secure login with username and password
- **Admin Dashboard**: Create, edit, and delete blog posts
- **SQLite Database**: Persistent storage for posts
- **Session-based Authentication**: Simple cookie-based authentication

### Default Credentials
- **Username**: `admin`
- **Password**: `password`

## Project Structure
```
test-2-cms/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page listing posts
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   ├── globals.css           # Global styles
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Admin login page
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # Admin dashboard
│   │   └── api/
│   │       ├── posts/
│   │       │   ├── route.ts      # GET all posts
│   │       │   ├── create/
│   │       │   │   └── route.ts  # POST create post
│   │       │   ├── update/
│   │       │   │   └── route.ts  # PUT update post
│   │       │   └── delete/
│   │       │       └── route.ts  # DELETE post
│   │       └── auth/
│   │           ├── login/
│   │           │   └── route.ts  # POST login
│   │           ├── logout/
│   │           │   └── route.ts  # POST logout
│   │           └── check/
│   │               └── route.ts  # GET auth check
│   └── lib/
│       ├── db.ts                 # SQLite database setup
│       └── auth-context.tsx      # Auth context provider
├── data/
│   └── blog.db                   # SQLite database (created automatically)
├── package.json
└── tsconfig.json
```

## Getting Started

### Installation
The project is already scaffolded with dependencies installed. To verify:
```bash
npm install
```

### Running Development Server
The dev server is already running on `http://localhost:3000`

To run manually:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts/create` - Create a post (requires authentication)
- `PUT /api/posts/update` - Update a post (requires authentication)
- `DELETE /api/posts/delete` - Delete a post (requires authentication)

### Authentication
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check if authenticated

## Using the Application

### Public Features (Home Page)
1. Navigate to `http://localhost:3000`
2. View all published blog posts
3. Click "Admin" to access the login page

### Admin Features
1. Go to `http://localhost:3000/admin/login`
2. Enter username: `admin` and password: `password`
3. Click "Logout" in the dashboard to log out

### Managing Posts
1. After logging in, you're on the admin dashboard
2. Click "Create New Post" to add a new post
3. Fill in the title and content
4. Click "Create Post" to save
5. Edit posts by clicking the "Edit" button on any post
6. Delete posts by clicking the "Delete" button

## Important Notes
- The database is stored in `data/blog.db` (SQLite)
- The session token is stored in a secure HTTP-only cookie
- Change the default credentials and `SESSION_SECRET` in `src/lib/auth.ts` before deploying to production
- The `better-sqlite3` package is used for database operations and requires native compilation

## Technology Stack
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: Server-side sessions with cookies
- **State Management**: React Context API

## Troubleshooting

### Database Issues
If the database file is corrupted, delete the `data/blog.db` file and restart the server. It will be recreated automatically.

### Port Already in Use
If port 3000 is already in use, the server will try the next available port. Check the terminal output for the actual port.

### Authentication Not Working
Ensure cookies are enabled in your browser and you're using the correct credentials (admin/password).
