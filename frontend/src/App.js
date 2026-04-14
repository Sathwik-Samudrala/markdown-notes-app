import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NotesList from "./components/NotesList";
import Editor from "./components/Editor";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ FIX: correct API handling
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notes");
      setNotes(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ✅ FIX search (safe)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchNotes();
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/notes`
        );

        const filtered = res.data.filter((note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setNotes(filtered);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ FIX create
  const handleCreateNote = async () => {
    const newNote = {
      title: "Untitled Note",
      content: "# New Note\n\nStart writing here...",
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/notes",
        newNote
      );

      setNotes((prev) => [res.data, ...(prev || [])]);
      setSelectedNote(res.data);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  // ✅ FIX update
  const handleUpdateNote = useCallback((updatedNote) => {
    setSelectedNote(updatedNote);

    setNotes((prev) =>
      (prev || []).map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      )
    );

    setSaveStatus("saving");

    const timer = setTimeout(async () => {
      try {
        await axios.put(
          `http://localhost:5000/notes/${updatedNote.id}`,
          updatedNote
        );

        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (err) {
        console.error("Save error:", err);
        setSaveStatus("error");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // ✅ FIX delete
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);

      setNotes((prev) =>
        (prev || []).filter((n) => n.id !== id)
      );

      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={`app-wrapper ${darkMode ? "dark" : ""}`}>
      <header className="app-header">
        <div className="header-left">
          <span className="app-logo">📝</span>
          <h1 className="app-title">NoteFlow</h1>
        </div>

        <div className="header-center">
          <input
            className="search-input"
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-right">
          {saveStatus === "saving" && (
            <span className="save-badge saving">Saving...</span>
          )}
          {saveStatus === "saved" && (
            <span className="save-badge saved">Saved ✓</span>
          )}

          <button
            className="dark-toggle"
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <button className="new-note-btn" onClick={handleCreateNote}>
            + New Note
          </button>

          {loading ? (
            <p className="loading-text">Loading notes...</p>
          ) : (
            <NotesList
              notes={notes}
              selectedNote={selectedNote}
              onSelect={setSelectedNote}
              onDelete={handleDeleteNote}
            />
          )}
        </aside>

        <main className="editor-area">
          {selectedNote ? (
            <Editor note={selectedNote} onUpdate={handleUpdateNote} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h2>No note selected</h2>
              <p>Pick a note from the sidebar or create a new one</p>
              <button className="new-note-btn" onClick={handleCreateNote}>
                + Create Note
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;