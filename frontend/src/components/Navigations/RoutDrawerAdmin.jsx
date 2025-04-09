import React from "react";
import { Routes, Route } from "react-router-dom";
import DrawerNavAdmin from "./DrawerNavAdmin.jsx";
import AddDoctor from "../addDoctor/AddDoctor.jsx";
import Doctors from "../Doctors/Doctors.jsx";

const RoutDrawer = () => {
  return (
    <div style={{ display: "flex" }}>
      <DrawerNavAdmin />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<AddDoctor />} />
          <Route path="/Doctors" element={<Doctors />} /> 
          <Route path="/AddDoctor" element={<AddDoctor />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default RoutDrawer;
