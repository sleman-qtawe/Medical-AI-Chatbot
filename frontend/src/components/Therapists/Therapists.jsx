import { useState } from "react";
import "./Therapists.css"; // Make sure to import the CSS

export default function Therapists() {
  const [therapists, setTherapists] = useState([
    { id: 1, name: "Mohammed Ali", email: "mohammed@example.com", phone: "052-9876543" },
    { id: 2, name: "Layla Hassan", email: "laila@example.com", phone: "054-7654321" },
  ]);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const deleteTherapist = (id) => {
    setTherapists(therapists.filter((t) => t.id !== id));
  };

  const startEditing = (therapist) => {
    setEditingTherapist(therapist);
    setShowModal(true); // Show the modal when edit button is clicked
  };

  const updateTherapist = (updatedTherapist) => {
    setTherapists(
      therapists.map((t) =>
        t.id === updatedTherapist.id ? { ...t, ...updatedTherapist } : t
      )
    );
    setShowModal(false); // Close modal after update
    setEditingTherapist(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Therapists List</h2>

      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map((therapist) => (
            <tr key={therapist.id}>
              <td>{therapist.name}</td>
              <td>{therapist.email}</td>
              <td>{therapist.phone}</td>
              <td>
                <button className="btn btn-warning btn-sm mx-1" onClick={() => startEditing(therapist)}>
                  Edit
                </button>
                <button onClick={() => deleteTherapist(therapist.id)} className="btn btn-danger btn-sm mx-1">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing a therapist */}
      {showModal && editingTherapist && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Therapist</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedTherapist = {
                  id: editingTherapist.id,
                  name: e.target.elements.namedItem("name").value,
                  email: e.target.elements.namedItem("email").value,
                  phone: e.target.elements.namedItem("phone").value,
                };
                updateTherapist(updatedTherapist);
              }}
            >
              <input
                type="text"
                name="name"
                defaultValue={editingTherapist.name}
                className="form-control mb-2"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={editingTherapist.email}
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                name="phone"
                defaultValue={editingTherapist.phone}
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
