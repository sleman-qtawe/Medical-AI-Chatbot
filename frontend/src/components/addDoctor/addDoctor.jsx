import { useState } from "react";
import './addDoctor.css';

export default function AddDoctor() {
  const [doctor, setDoctor] = useState({
    id: "", name: "", email: "", speciality: "", password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      password: doctor.password,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Doctor added successfully!");
        setDoctor({ id: "", name: "", email: "", speciality: "", password: "" });
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Something went wrong.");
      console.error(error);
    }
  };

  return (
    <div className="add-doctors-page">
      <h1>Add New Doctor</h1>
      <form onSubmit={handleSubmit} className="doctor-form">
        <div className="form-group">
          <label>ID:</label>
          <input type="text" value={doctor.id} onChange={(e) => setDoctor({ ...doctor, id: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={doctor.name} onChange={(e) => setDoctor({ ...doctor, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={doctor.email} onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Speciality:</label>
          <input type="text" value={doctor.speciality} onChange={(e) => setDoctor({ ...doctor, speciality: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={doctor.password} onChange={(e) => setDoctor({ ...doctor, password: e.target.value })} required />
        </div>
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
}
