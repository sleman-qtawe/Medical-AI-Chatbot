import React from "react";
import { Routes, Route } from "react-router-dom";
import DrawerNavAdmin from "./DrawerNavAdmin.jsx";
import AddDoctor from "../addDoctor/AddDoctor.jsx";
import Doctors from "../Doctors/Doctors.jsx";
import ChatBot from "../ChatBot/chatBot.jsx"; 

const RoutDrawer = () => {
  return (
    <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<DrawerNavAdmin />}>
          <Route index element={<ChatBot />} />
          <Route path="Doctors" element={<Doctors />} />
          <Route path="AddDoctor" element={<AddDoctor />} />
          <Route path="ChatBot" element={<ChatBot />} />
        </Route>
      </Routes>
    </div>
  );
};
export default RoutDrawer;
