import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorProgram from '../Doctor/doctorProgram';
import CalenderPage from '../Doctor/CalenderPage'
import DrawerNavDoctor from './DrawerNavDoctor';


const RoutDrawer = () => {
  return (
    <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<DrawerNavDoctor />}>
          <Route index element={<Navigate to="DoctorProgram" />} />
          <Route path="DoctorProgram" element={<DoctorProgram />} />
          <Route path="CalenderPage" element={<CalenderPage />} />

        </Route>
      </Routes>
    </div>
  );
}
export default RoutDrawer