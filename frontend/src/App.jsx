import React from "react";
import LoginSignup from "./components/logIn_signUp/login_signUp.jsx";
import RoutDrawerPatient from "./components/Navigations/RoutDrawerPatient.jsx";
import RoutDrawerDoctor from "./components/Navigations/RoutDrawerDoctor.jsx";
import RoutDrawer from "./components/Navigations/RoutDrawerAdmin.jsx"; // Admin
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");
  let userType = null;

  try {
    const user = JSON.parse(atob(token.split(".")[1]));
    userType = user?.role;
  } catch (e) {
    userType = null;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userType === "admin" ? (
            <Navigate to="/admin" replace />
          ) : userType === "doctor" ? (
            <Navigate to="/doctor" replace />
          ) : userType === "patient" ? (
            <Navigate to="/patient" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<LoginSignup />} />
      <Route path="/admin/*" element={<RoutDrawer />} />
      <Route path="/doctor/*" element={<RoutDrawerDoctor />} />
      <Route path="/patient/*" element={<RoutDrawerPatient />} />
    </Routes>
  );
}

export default App;