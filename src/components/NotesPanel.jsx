import React, { useState, useEffect } from "react";

const NotesPanel = () => {
  const [note, setNote] = useState("");

  // Load saved note
  useEffect(() => {
    const saved = localStorage.getItem("calendar-note");
    if (saved) {
      setNote(saved);
    }
  }, []);

  // Save note
  const handleSave = () => {
    localStorage.setItem("calendar-note", note);
    alert("Note saved!");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Notes</h3>

      <textarea
        rows="5"
        cols="25"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your notes..."
      />

      <br />

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default NotesPanel;