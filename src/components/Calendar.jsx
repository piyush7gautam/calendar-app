import React, { useState, useEffect } from "react";
import "../styles/calendar.css";
import NotesPanel from "./NotesPanel";
import { getDaysInMonth, getFirstDay } from "../utils/dateUtils";

const Calendar = () => {

  // ✅ Notes state (with persistence)
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  // ✅ Current month/year
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // ✅ Range selection
  const [range, setRange] = useState({
    start: null,
    end: null,
  });

  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDay(year, month);

  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];

  // Empty before start
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  // Fill grid
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // ✅ Unique key for each date
  const getDateKey = (day) => `${year}-${month}-${day}`;

  // ✅ Navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setRange({ start: null, end: null });
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setRange({ start: null, end: null });
  };

  // ✅ Click
  const handleDateClick = (day) => {
    if (!day) return;

    const key = getDateKey(day);

    setSelectedDate(day);
    setNoteInput(notes[key] || "");

    if (!range.start || (range.start && range.end)) {
      setRange({ start: day, end: null });
    } else {
      setRange({ ...range, end: day });
    }
  };

  // ✅ Save note
  const handleSaveNote = () => {
    if (!selectedDate) return;

    const key = getDateKey(selectedDate);

    const updated = {
      ...notes,
      [key]: noteInput,
    };

    setNotes(updated);
  };

  // ✅ Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calendarNotes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
  }, [notes]);

  return (
    <div className="calendar-container">

      {/* Header */}
      <div className="calendar-header">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          alt="calendar"
        />

        <h2 style={{
          position: "absolute",
          bottom: "10px",
          right: "15px",
          color: "white"
        }}>
          {monthNames[month]} {year}
        </h2>

        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          gap: "10px"
        }}>
          <button onClick={goToPrevMonth}>←</button>
          <button onClick={goToNextMonth}>→</button>
        </div>
      </div>

      {/* Body */}
      <div className="calendar-body">

        {/* Notes */}
        <div className="notes">
          <NotesPanel
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            handleSaveNote={handleSaveNote}
          />
        </div>

        {/* Grid */}
        <div className="grid">

          {weekDays.map((day) => (
            <div key={day} className="day" style={{ fontWeight: "bold" }}>
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const key = day ? getDateKey(day) : null;

            const isSelected =
              day && (day === range.start || day === range.end);

            const inRange =
              day &&
              range.start &&
              range.end &&
              day >= range.start &&
              day <= range.end;

            return (
              <div
                key={index}
                onClick={() => day && handleDateClick(day)}
                className={`day ${isSelected ? "selected" : ""} ${inRange ? "range" : ""}`}
              >
                {day || ""}

                {/* 🔥 DOT INDICATOR */}
                {day && notes[key] && (
                  <div style={{
                    width: "6px",
                    height: "6px",
                    background: "red",
                    borderRadius: "50%",
                    margin: "4px auto 0"
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;