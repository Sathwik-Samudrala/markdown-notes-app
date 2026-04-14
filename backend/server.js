const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(path.join(__dirname, "notes.db"), (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// GET all notes
app.get("/notes", (req, res) => {
  const sql = "SELECT * FROM notes ORDER BY updated_at DESC";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ notes: rows });
  });
});

// GET single note
app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Note not found" });
    res.json({ note: row });
  });
});

// POST create note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const sql = "INSERT INTO notes (title, content) VALUES (?, ?)";
  db.run(sql, [title, content || ""], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT * FROM notes WHERE id = ?", [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ note: row });
    });
  });
});

// PUT update note
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const sql =
    "UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
  db.run(sql, [title, content, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Note not found" });
    db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ note: row });
    });
  });
});

// DELETE note
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM notes WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  });
});

// SEARCH notes
app.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Search query required" });
  const sql =
    "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC";
  const searchTerm = `%${q}%`;
  db.all(sql, [searchTerm, searchTerm], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ notes: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});