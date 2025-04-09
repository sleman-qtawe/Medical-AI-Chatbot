import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import DrawerNavAdmin from "./components/Navigations/DrawerNavAdmin";
import AddDoctors  from "./components/addDoctor/addDoctor.jsx"; 
import Doctors from "./components/Doctors/Doctors.jsx";

<Router>
      <div>
        <DrawerNavAdmin />
        <Routes>
          <Route path="/" element={""} />
          <Route path="/adddoctors" element={<AddDoctors />} />
          <Route path="/doctors" element={<Doctors />} />
        </Routes>
      </div>
    </Router>