import { useState } from "react";
import './addDepartment.css';

export default function AddDepartment() {
  const [department, setDepartment] = useState({
    name: "",
    building: "",
    floor: "",
    rooms: [""]
  });

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "room" && index !== null) {
      const updatedRooms = [...department.rooms];
      updatedRooms[index] = value;
      setDepartment({ ...department, rooms: updatedRooms });
    } else {
      setDepartment({ ...department, [name]: value });
    }
  };

  const addRoom = () => {
    setDepartment({ ...department, rooms: [...department.rooms, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newDepartment = {
      name: department.name,
      building: department.building,
      floor: department.floor,
      rooms: department.rooms,
    };

    console.log("Sending department:", newDepartment);
    try {
        const response = await fetch("http://127.0.0.1:5000/addDepartment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDepartment),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Department added successfully!");
          setDepartment({ name: "", building: "", floor: "", rooms: [] }); // Reset rooms to an empty array
        } else {
          alert(`Failed: ${data.error}`);
        }
      } catch (error) {
        alert("Something went wrong.");
        console.error(error);
      }
    };

  return (
    <div className="add-department-page">
      <h1>Add New Department</h1>
      <form onSubmit={handleSubmit} className="department-form">
        <div className="form-group">
          <label>Department Name:</label>
          <input
            type="text"
            name="name"
            value={department.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Building Number:</label>
          <input
            type="text"
            name="building"
            value={department.building}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Floor:</label>
          <input
            type="text"
            name="floor"
            value={department.floor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Room Numbers:</label>
          {department.rooms.map((room, index) => (
            <input
              key={index}
              type="text"
              name="room"
              value={room}
              onChange={(e) => handleChange(e, index)}
              className="room-input"
              required
            />
          ))}
          <button type="button" className="add-room-btn" onClick={addRoom}>
            + Add Room
          </button>
        </div>

        <button type="submit" className="submit-btn">Add Department</button>
      </form>
    </div>
  );
}
