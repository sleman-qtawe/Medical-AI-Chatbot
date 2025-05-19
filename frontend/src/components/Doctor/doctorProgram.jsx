import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './doctorProgram.css';

const appointments = [
  { date: '2025-04-15', patient: 'John Doe', time: '10:00 AM', type: 'General Checkup' },
  { date: '2025-04-15', patient: 'Jane Smith', time: '11:00 AM', type: 'Dental' },
  { date: '2025-04-16', patient: 'Emily Davis', time: '02:00 PM', type: 'Eye Exam' },
  { date: '2025-04-17', patient: 'Michael Johnson', time: '09:00 AM', type: 'Cardiology' },
];

function DoctorProgram() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isDateSelected, setIsDateSelected] = useState(false);

  const handleDateSelect = (date) => {
    const isoDate = date.toISOString().split('T')[0];
    setSelectedDate(isoDate);
    setIsDateSelected(true);

    const patientsForSelectedDate = appointments.filter(
      (appointment) => appointment.date === isoDate
    );
    setPatients(patientsForSelectedDate);
  };

  const goBackToCalendar = () => {
    setIsDateSelected(false);
    setSelectedDate(null);
    setPatients([]);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-[#0fa4af]">
        Doctor's Calendar
      </h2>

      {!isDateSelected ? (
        <div className="mb-6">
          <Calendar
            onChange={handleDateSelect}
            value={selectedDate ? new Date(selectedDate) : null}
            className="react-calendar"
            locale="en-US"
          />
        </div>
      ) : (
        <div className="mt-6">
          <button
            onClick={goBackToCalendar}
            className="mb-4 px-4 py-2 text-sm bg-[#0fa4af] text-white rounded hover:bg-[#0d8c96]"
          >
            ← Go Back
          </button>

          <h3 className="text-lg font-bold mb-4 text-center text-[#0fa4af]">
            Appointments on {new Date(selectedDate).toLocaleDateString('en-GB')}
          </h3>

          {patients.length > 0 ? (
            <div className="table-wrapper">
              <table className="w-full text-sm text-left text-gray-700 border border-gray-300 custom-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Time</th>
                    <th>Checkup Type</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.patient}</td>
                      <td>{patient.time}</td>
                      <td>{patient.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No appointments for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}
export default DoctorProgram