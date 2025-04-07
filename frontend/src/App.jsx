import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/logIn_signUp/login_signUp";
import PrivateRoute from "./components/PrivateRoute";

import DrawerNavAdmin from "./components/Navigations/DrawerNavAdmin";
import AddDoctors from "./components/Doctors/Doctors";
import DropdownsPage from "./components/Dropdowns/Dropdowns";

import SidebarPatient from "./components/Patient/SidebarPatient";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <DrawerNavAdmin />
          </PrivateRoute>
        } />

        <Route path="/profile" element={<SidebarPatient />} />
        <Route path="/chat" element={<SidebarPatient />} />
        <Route path="/appointments" element={<SidebarPatient />} />
        <Route path="/logout" element={<SidebarPatient />} />

        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
