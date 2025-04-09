import React from "react";
import LoginSignup from "./components/logIn_signUp/login_signUp.jsx";
import RoutDrawerPatient from "./components/Navigations/RoutDrawerPatient.jsx";
import RoutDrawerDoctor from "./components/Navigations/RoutDrawerDoctor.jsx";
import { Routes, Route } from "react-router-dom";
import RoutDrawer from "./components/Navigations/RoutDrawerAdmin.jsx";



function App() {
  return (
    <Routes>
    <Route path="/" element={<LoginSignup />} />
    <Route path="/*" element={<RoutDrawer/>} />
    <Route path="/*" element={<RoutDrawerDoctor />} />
    <Route path="/*" element={<RoutDrawerPatient/>} />
  </Routes>
  );
}

export default App;