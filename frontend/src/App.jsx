import React from "react";
import LoginSignup from "./components/logIn_signUp/login_signUp.jsx";
import  DrawerNavDoctor  from "./components/Navigations/DrawerNavDoctor.jsx";
import  DrawerNavPatient  from "./components/Navigations/DrawerNavPatient.jsx";
import DrawerNavAdmin from "./components/Navigations/DrawerNavAdmin.jsx";
import { Routes, Route } from "react-router-dom";



function App() {
  return (
    <Routes>
    <Route path="/" element={<LoginSignup />} />
    <Route path="/DrawerNavAdmin" element={<DrawerNavAdmin />} />
    <Route path="/DrawerNavPatient" element={<DrawerNavPatient />} />
    <Route path="/DrawerNavDoctor" element={<DrawerNavDoctor />} />
  </Routes>
  );
}

export default App;