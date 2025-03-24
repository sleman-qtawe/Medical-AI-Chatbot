import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/logIn_signUp/login_signUp";
import DrawerNavAdmin from "./components/Navigations/DrawerNavAdmin";
import PrivateRoute from "./components/PrivateRoute";
import AddDoctors from "./components/Doctors/Doctors";
import DropdownsPage from "./components/Dropdowns/Dropdowns";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DrawerNavAdmin />
            </PrivateRoute>
          }
        >
          <Route index element={<DropdownsPage />} />
          <Route path="dropdowns" element={<DropdownsPage />} />
          <Route path="adddoctors" element={<AddDoctors />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;



