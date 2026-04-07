import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/calendar.css";
import NotesPanel from "./NotesPanel";
import { getDaysInMonth, getFirstDay } from "../utils/dateUtils";

const Calendar = () => {

  // ✅ Notes state
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  // ✅ Current date (month navigation)
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // ✅ Range selection
  const [range, setRange] = useState({
    start: null,
    end: null,
  });

  // ✅ Days calculation
  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDay(year, month);

  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];

  // Empty slots
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  // Fill remaining grid
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // ✅ Unique key
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

  // ✅ Click date
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

  // ✅ Delete note
  const handleDeleteNote = () => {
    if (!selectedDate) return;

    const key = getDateKey(selectedDate);

    const updated = { ...notes };
    delete updated[key];

    setNotes(updated);
    setNoteInput("");
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

  useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}, []);
useEffect(() => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  if (notes[todayKey]) {
    new Notification("📅 Reminder", {
      body: notes[todayKey],
    });
  }
}, [notes]);

  return (
    <div className="calendar-container">

      {/* HEADER */}
      <div className="calendar-header">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          alt="calendar"
        />

        {/* Month text */}
        <h2
          style={{
            position: "absolute",
            bottom: "10px",
            right: "15px",
            color: "white",
          }}
        >
          {monthNames[month]} {year}
        </h2>

        {/* Navigation */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button className="nav-btn" onClick={goToPrevMonth}>←</button>
          <button className="nav-btn" onClick={goToNextMonth}>→</button>
        </div>
      </div>

      {/* BODY */}
      <div className="calendar-body">

        {/* NOTES PANEL */}
        <div className="notes">
          <NotesPanel
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            handleSaveNote={handleSaveNote}
            handleDeleteNote={handleDeleteNote}
            selectedDate={selectedDate}
          />
        </div>

        {/* GRID */}
        <motion.div
          key={month}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
           
          transition={{ duration: 0.3 }}
          className="grid"
        >

          {/* Week days */}
          {weekDays.map((day) => (
            <div key={day} className="day" style={{ fontWeight: "bold" }}>
              {day}
            </div>
          ))}

          {/* Dates */}
          {days.map((day, index) => {
            const today = new Date();

            const isToday =
              day &&
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

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
              <motion.div
                key={index}
                onClick={() => day && handleDateClick(day)}
                className={`day 
                  ${isSelected ? "selected" : ""} 
                  ${inRange ? "range" : ""} 
                  ${isToday ? "today" : ""}
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {day || ""}

                {/* 🔴 Note dot */}
                {day && notes[key] && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#ff4d4f",
                      borderRadius: "50%",
                      margin: "4px auto 0",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;