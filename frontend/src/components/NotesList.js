import React from "react";
import "./NotesList.css";

function NotesList({ notes = [], selectedNote, onSelect, onDelete }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="notes-empty">
        <p>No notes yet.</p>
        <span>Create your first note! 🌱</span>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPreview = (content) => {
    if (!content) return "No content...";
    const stripped = content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/\n/g, " ")
      .trim();
    return stripped.length > 70 ? stripped.slice(0, 70) + "..." : stripped;
  };

  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li
          key={note.id}
          className={`note-card ${selectedNote && selectedNote.id === note.id ? "active" : ""}`}
          onClick={() => onSelect(note)}
        >
          <div className="note-card-top">
            <span className="note-title">{note.title || "Untitled"}</span>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              title="Delete note"
            >
              🗑
            </button>
          </div>
          <p className="note-preview">{getPreview(note.content)}</p>
          <span className="note-date">{formatDate(note.updated_at)}</span>
        </li>
      ))}
    </ul>
  );
}

export default NotesList;