import { useState, useEffect } from "react";
import "./Doctors.css";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  
  const deleteDoctor = (id) => {
    setDoctors(doctors.filter((doc) => doc._id !== id));
  };

  const startEditing = (doctor) => {
    setEditingDoctor(doctor);
    setShowModal(true);
  };

  const showDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  return (
    <div className="container mt-5">
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>Actions</th>
            <th>Name</th>
            <th>Phone</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>
                <button className="btn btn-custom btn-sm mx-1" onClick={() => startEditing(doctor)}>
                  <FaEdit />
                </button>
                <button onClick={() => deleteDoctor(doctor._id)} className="btn btn-danger btn-sm mx-1">
                  <FaTrash />
                </button>
              </td>
              <td>{doctor.name}</td>
              <td>{doctor.phone}</td>
              <td>
                <button className="btn btn-success btn-sm mx-1" onClick={() => showDetails(doctor)}>
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && editingDoctor && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Doctor</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedDoctor = {
                  name: e.target.elements.namedItem("name").value,
                  email: e.target.elements.namedItem("email").value,
                  phone: e.target.elements.namedItem("phone").value,
                  specialty: e.target.elements.namedItem("specialty").value,
                };

                fetch(`http://127.0.0.1:5000/update/doctors/${editingDoctor._id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatedDoctor),
                })
                  .then((res) => res.json())
                  .then(() => {
                    alert("Doctor updated successfully!");
                    setShowModal(false);
                    setEditingDoctor(null);
                    // تحديث البيانات بعد التعديل
                    fetch("http://127.0.0.1:5000/doctors")
                      .then((res) => res.json())
                      .then((data) => setDoctors(data));
                  })
                  .catch(() => alert("Error updating doctor"));
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

      {showDetailsModal && selectedDoctor && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Doctor Details</h3>
            <p><strong>Name:</strong> {selectedDoctor.name}</p>
            <p><strong>Email:</strong> {selectedDoctor.email}</p>
            <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
            <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setShowDetailsModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
