import React from "react";

const NotesPanel = ({
  noteInput,
  setNoteInput,
  handleSaveNote,
  handleDeleteNote,
  selectedDate
}) => {
  return (
    <div>
      <h3>Notes</h3>

      <h4>Selected: {selectedDate || "None"}</h4>

      <textarea
        value={noteInput}
        onChange={(e) => setNoteInput(e.target.value)}
        placeholder="Write your notes..."
        rows={5}
        style={{ width: "100%" }}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={handleSaveNote}>Save</button>

        {/* 🔥 DELETE BUTTON */}
        <button
          onClick={handleDeleteNote}
          style={{ background: "#ff4d4f", color: "white" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;