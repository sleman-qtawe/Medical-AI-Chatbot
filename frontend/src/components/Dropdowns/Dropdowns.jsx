import React , { useState } from 'react';
import Doctors from '../Doctors/Doctors';
import Healer from '../Healer/Healer';
function Dropdowns() {
    const [selectedOption, setSelectedOption] = useState("doctors");

    const handleDropdownChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    return (
      <div className="container mt-5">
<h1 className="text-center mb-4 text-custom">Doctors and Healers</h1>
<div className="mb-4">
          <select
            id="dropdown"
            className="form-select w-50 mx-auto shadow-sm"
            value={selectedOption}
            onChange={handleDropdownChange}
          >
            <option value="doctors">Doctors</option>
            <option value="healer">Healer</option>
          </select>
        </div>
  
        <div className="mt-4">
          {selectedOption === "doctors" ? <Doctors /> : <Healer />}
        </div>
      </div>
    );
}

export default Dropdowns
