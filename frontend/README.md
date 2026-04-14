# NoteFlow – Markdown Notes App

A full-stack notes application with live Markdown preview, built with React, Node.js, Express, and SQLite.

---

## Features

- Create, edit, delete notes
- Live split-screen Markdown preview
- Debounced auto-save (saves 800ms after you stop typing)
- Search notes by title or content
- Dark mode toggle
- Supports: headings, bold, italic, lists, code blocks, links, tables

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React.js, react-markdown, axios |
| Backend | Node.js, Express |
| Database | SQLite (via sqlite3) |

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/markdown-notes-app.git
cd markdown-notes-app
```

### 2. Setup Backend

```bash
cd backend
npm install
node server.js
```

Backend runs on: `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notes | Get all notes |
| GET | /notes/:id | Get single note |
| POST | /notes | Create new note |
| PUT | /notes/:id | Update note |
| DELETE | /notes/:id | Delete note |
| GET | /search?q=query | Search notes |

---

## Database Schema

```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

No manual migration needed — auto-created on server start.

---

## Project Structure

```
markdown-notes-app/
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js
        ├── App.css
        ├── index.js
        ├── index.css
        └── components/
            ├── Editor.js
            ├── Editor.css
            ├── NotesList.js
            └── NotesList.css
```