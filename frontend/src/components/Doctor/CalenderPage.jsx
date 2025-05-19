import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import './doctorProgram.css';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const handleDateSelect = (date) => {
    const formatted = date.toLocaleDateString('en-GB').replaceAll('/', '-'); // Format like "15-04-2025"
    navigate(`/appointments/${formatted}`);
  };


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-[#0fa4af]">
        Doctor's Calendar
      </h2>
      <Calendar
        onChange={handleDateSelect}
        value={selectedDate}
        className="react-calendar"
        locale="en-GB"
      />
    </div>
  );
}