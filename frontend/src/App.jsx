import React from "react";
import Dropdowns from "./components/Dropdowns/Dropdowns";
import LoginSignup from "./components/logIn_signUp/login_signUp";

function App() {
  return (
   <>
     {/*  <Router>
      <div>
        <DrawerNavAdmin />
        <Routes>
          <Route path="/" element={<EditUsers />} />
          <Route path="/adddoctors" element={<AddDoctors />} />
        </Routes>
      </div>
    </Router>*/}
   <LoginSignup/>
   </>
  );
}

export default App;
