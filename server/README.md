# Backend Server Setup

## Quick Start

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Start the server:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## Features

✅ **SQLite Database** - All data stored in `newsapp.db`
✅ **JWT Authentication** - Secure token-based auth
✅ **Password Hashing** - bcrypt encryption
✅ **Cross-Device Sync** - Login from any device
✅ **User Isolation** - Complete data separation
✅ **Admin Access** - User "admin" can view all users

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/users` - Get all users (admin only)

### Articles
- `POST /api/articles` - Save article
- `GET /api/articles` - Get user articles
- `PATCH /api/articles/:id/bookmark` - Toggle bookmark
- `DELETE /api/articles/:id` - Delete article

### PDFs
- `POST /api/pdfs` - Save PDF
- `GET /api/pdfs` - Get user PDFs
- `PATCH /api/pdfs/:id/bookmark` - Toggle bookmark
- `DELETE /api/pdfs/:id` - Delete PDF

### Preferences
- `POST /api/preferences` - Save preferences
- `GET /api/preferences` - Get preferences

### Stats
- `GET /api/stats` - Get user statistics

## Database Schema

**users** - User accounts
**articles** - News articles per user
**pdfs** - PDF documents per user
**preferences** - User settings

## Environment Variables

Create `.env` file:
```
PORT=5000
JWT_SECRET=your-secret-key
```

## Frontend Setup

Update `.env` in root:
```
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

1. Change `JWT_SECRET` in server/.env
2. Deploy backend to hosting service
3. Update `VITE_API_URL` to production URL
4. Build frontend: `npm run build`
