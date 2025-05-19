import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatBot from '../Patient/chatBot';
import Healer from '../Patient/Healer';
import PatientProfile from '../Patient/PatientProfile';
import DrawerNavPatient from './DrawerNavPatient';

 const RoutDrawerPatient = () => {
  return (
    <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<DrawerNavPatient />}>
          <Route index element={<Navigate to="ChatBot" />} />
          <Route path="ChatBot" element={<ChatBot />} />
          <Route path="Healer" element={<Healer />} />
          <Route path="PatientProfile" element={<PatientProfile />} />

        </Route>
      </Routes>
    </div>
  );
}
export default RoutDrawerPatient