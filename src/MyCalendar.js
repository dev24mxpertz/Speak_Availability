import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; 

const MyCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date()); // State to store selected date
    const [timeSlots, setTimeSlots] = useState({}); // State to store time slots for each date
    const [startTime, setStartTime] = useState(''); // State to store start time
    const [endTime, setEndTime] = useState(''); // State to store end time
    const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility
    const [repeatWeekly, setRepeatWeekly] = useState(false); // State to manage repeat option
  
    // Function to handle adding a new time slot
    const handleAddSlot = () => {
      if (startTime && endTime) {
        const newSlot = {
          start: startTime,
          end: endTime,
        };
        const updatedTimeSlots = { ...timeSlots };
        const dateKey = selectedDate.toDateString();
        updatedTimeSlots[dateKey] = [...(updatedTimeSlots[dateKey] || []), newSlot];
        setTimeSlots(updatedTimeSlots);
        setStartTime('');
        setEndTime('');
        setModalOpen(false); // Close the modal after adding the time slot
      }
    };

    // Function to handle deleting a time slot
    const handleDeleteSlot = (index) => {
      const updatedTimeSlots = { ...timeSlots };
      const dateKey = selectedDate.toDateString();
      updatedTimeSlots[dateKey].splice(index, 1);
      setTimeSlots(updatedTimeSlots);
    };
  
    // Function to handle repeating time slots on selected weekday within the month
    const handleRepeatSlots = () => {
        if (startTime && endTime) {
          const selectedWeekday = selectedDate.getDay();
          const selectedMonth = selectedDate.getMonth();
          const selectedYear = selectedDate.getFullYear();
          const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      
          const updatedTimeSlots = { ...timeSlots };
      
          for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(selectedYear, selectedMonth, day);
            if (currentDate.getDay() === selectedWeekday) {
              const dateKey = currentDate.toDateString();
              if (!updatedTimeSlots[dateKey]) {
                updatedTimeSlots[dateKey] = [];
              }
              updatedTimeSlots[dateKey].push({ start: startTime, end: endTime });
            }
          }
      
          setTimeSlots(updatedTimeSlots);
          setModalOpen(false);
        } else {
          alert('Please select both start and end time before repeating.');
        }
      };
    // Function to handle opening the modal when a date is clicked
    const handleCalendarClick = (value) => {
      setSelectedDate(value);
      setModalOpen(true);
    };
  
    // Get time slots for the selected date
    const slotsForSelectedDate = timeSlots[selectedDate.toDateString()] || [];
  
    // Function to determine if a date has time slots
    const hasSlots = (date) => {
      const dateKey = date.toDateString();
      return timeSlots[dateKey] && timeSlots[dateKey].length > 0;
    };

    // Function to format time with AM or PM indication
    const formatTime = (time) => {
      const [hours, minutes] = time.split(":");
      const formattedHours = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) < 12 ? "AM" : "PM";
      return `${formattedHours}:${minutes} ${ampm}`;
    };
  
    // Custom tile content function to highlight dates with time slots
    const tileClassName = ({ date }) => {
      return hasSlots(date) ? 'has-slots' : null;
    };
  
    return (
      <div className="calendar-container">
        <div className="calendar">
          <Calendar
            onChange={handleCalendarClick}
            value={selectedDate}
            tileClassName={tileClassName}
          />
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Time Slots for {selectedDate.toDateString()}</h2>
              <ul>
                {slotsForSelectedDate.map((slot, index) => (
                  <li key={index}>
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                    <button onClick={() => handleDeleteSlot(index)}>Delete</button>
                  </li>
                ))}
              </ul>
              <div>
                <label htmlFor="start">Start Time:</label>
                <input
                  type="time"
                  id="start"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <label htmlFor="end">End Time:</label>
                <input
                  type="time"
                  id="end"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                <button onClick={handleAddSlot}>Add Time Slot</button>
                <button onClick={handleRepeatSlots}>Repeat Weekly</button>
                <button onClick={() => setModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
export default MyCalendar;
