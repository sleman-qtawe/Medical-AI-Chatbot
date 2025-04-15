import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './doctorProgram.css';

const appointments = [
  { date: '15-04-2025', patient: 'John Doe', time: '10:00 AM', type: 'General Checkup' },
  { date: '15-04-2025', patient: 'Jane Smith', time: '11:00 AM', type: 'Dental' },
  { date: '16-04-2025', patient: 'Emily Davis', time: '02:00 PM', type: 'Eye Exam' },
  { date: '17-04-2025', patient: 'Michael Johnson', time: '09:00 AM', type: 'Cardiology' },
];

export default function AppointmentsPage() {
  const { date } = useParams();
  const navigate = useNavigate();

  const dailyAppointments = appointments.filter((appt) => appt.date === date);

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="container">
        <h3 className="text-lg font-bold mb-4 text-center text-[#0fa4af]">
          Appointments on {date}
        </h3>

        {dailyAppointments.length > 0 ? (
          <div className="table-container">
            <table className="w-full text-sm text-left text-gray-700 border border-gray-300">
              <thead className="text-xs uppercase bg-[#0fa4af] text-white">
                <tr>
                  <th className="px-4 py-2">Patient Name</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Checkup Type</th>
                </tr>
              </thead>
              <tbody>
                {dailyAppointments.map((appt, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-blue-50">
                    <td className="px-4 py-2">{appt.patient}</td>
                    <td className="px-4 py-2">{appt.time}</td>
                    <td className="px-4 py-2">{appt.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No appointments for this day.</p>
        )}
      </div>
    </div>
  );
}
