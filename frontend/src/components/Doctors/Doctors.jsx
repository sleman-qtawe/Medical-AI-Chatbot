import { useState } from "react";
import "./Doctors.css"; // Make sure to import the CSS

export default function Doctors() {
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sleman", email: "sleman@example.com", phone: "050-1234567", specialty: "Cardiology" },
    { id: 2, name: "Dr. Sara", email: "sara@example.com", phone: "053-8765432", specialty: "Pediatrics" },
  ]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const deleteDoctor = (id) => {
    setDoctors(doctors.filter((doc) => doc.id !== id));
  };

  const startEditing = (doctor) => {
    setEditingDoctor(doctor);
    setShowModal(true); // Show the modal when edit button is clicked
  };

  const updateDoctor = (updatedDoctor) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === updatedDoctor.id ? { ...doc, ...updatedDoctor } : doc
      )
    );
    setShowModal(false); // Close modal after update
    setEditingDoctor(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Doctors List</h2>

      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specialty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.email}</td>
              <td>{doctor.phone}</td>
              <td>{doctor.specialty}</td>
              <td>
                <button className="btn btn-warning btn-sm mx-1" onClick={() => startEditing(doctor)}>
                  Edit
                </button>
                <button onClick={() => deleteDoctor(doctor.id)} className="btn btn-danger btn-sm mx-1">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing a doctor */}
      {showModal && editingDoctor && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Doctor</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedDoctor = {
                  id: editingDoctor.id,
                  name: e.target.elements.namedItem("name").value,
                  email: e.target.elements.namedItem("email").value,
                  phone: e.target.elements.namedItem("phone").value,
                  specialty: e.target.elements.namedItem("specialty").value,
                };
                updateDoctor(updatedDoctor);
              }}
            >
              <input
                type="text"
                name="name"
                defaultValue={editingDoctor.name}
                className="form-control mb-2"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={editingDoctor.email}
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                name="phone"
                defaultValue={editingDoctor.phone}
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                name="specialty"
                defaultValue={editingDoctor.specialty}
                className="form-control mb-2"
                required
              />
              <button className="btn btn-success w-100 mt-2">Save Changes</button>
            </form>
            <button className="btn btn-secondary mt-2" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
