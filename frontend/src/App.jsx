import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/logIn_signUp/login_signUp";
import DrawerNavAdmin from "./components/Navigations/DrawerNavAdmin";
import PrivateRoute from "./components/PrivateRoute";
import AddDoctors from "./components/Doctors/Doctors";
import DropdownsPage from "./components/Dropdowns/Dropdowns";

// من App1.jsx
import SidebarPatient from "./components/Patient/SidebarPatient";

function App() {
  return (
    <Router>
      <Routes>
        {/* مسارات تسجيل الدخول */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DrawerNavAdmin />
          </PrivateRoute>
        } />

        {/* مسارات الأدمن */}
        <Route index element={<DropdownsPage />} />
        <Route path="/dropdowns" element={<DropdownsPage />} />
        <Route path="/adddoctors" element={<AddDoctors />} />
        
        


        {/* 🩺 مسارات البروفايل للمريض */}
        <Route path="/profile" element={<SidebarPatient />} />
        <Route path="/chat" element={<SidebarPatient />} />
        <Route path="/appointments" element={<SidebarPatient />} />
        <Route path="/logout" element={<SidebarPatient />} />

        {/* إذا ما في مسار، نعيد التوجيه لتسجيل الدخول */}
        <Route path="/" element={<Navigate to="/chat" />} />

      </Routes>
    </Router>
  );
}

export default App;
