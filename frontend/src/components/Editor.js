import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Editor.css";

function Editor({ note, onUpdate }) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [activeTab, setActiveTab] = useState("split");

  useEffect(() => {
  setTitle(note.title);
  setContent(note.content);
}, [note]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    onUpdate({ ...note, title: val, content });
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    onUpdate({ ...note, title, content: val });
  };

  return (
    <div className="editor-container">
      <div className="editor-titlebar">
        <input
          className="title-input"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
        />
        <div className="view-tabs">
          <button
            className={`tab-btn ${activeTab === "editor" ? "active" : ""}`}
            onClick={() => setActiveTab("editor")}
          >
            Edit
          </button>
          <button
            className={`tab-btn ${activeTab === "split" ? "active" : ""}`}
            onClick={() => setActiveTab("split")}
          >
            Split
          </button>
          <button
            className={`tab-btn ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
      </div>

      <div className={`editor-body ${activeTab}`}>
        {(activeTab === "editor" || activeTab === "split") && (
          <div className="pane editor-pane">
            {activeTab === "split" && <div className="pane-label">Markdown</div>}
            <textarea
              className="markdown-textarea"
              value={content}
              onChange={handleContentChange}
              placeholder={`# Start writing your note\n\nSupports **bold**, *italic*, \`code\`, lists, links and more...`}
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === "split" && <div className="pane-divider" />}

        {(activeTab === "preview" || activeTab === "split") && (
          <div className="pane preview-pane">
            {activeTab === "split" && <div className="pane-label">Preview</div>}
            <div className="markdown-preview">
              {content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="preview-empty">Nothing to preview yet...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;