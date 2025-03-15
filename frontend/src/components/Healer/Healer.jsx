import { useState } from "react";
import "./Healer.css"; // Make sure to import the CSS
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function Healer() {
  const [healers, setHealers] = useState([
    { id: 1, name: "Mohammed Ali", email: "mohammed@example.com", phone: "052-9876543" },
    { id: 2, name: "Layla Hassan", email: "laila@example.com", phone: "054-7654321" },
  ]);
  const [editingHealer, setEditingHealer] = useState(null);
  const [showModal, setShowModal] = useState(false); // For edit modal
  const [showDetailsModal, setShowDetailsModal] = useState(false); // For healer details modal
  const [selectedHealer, setSelectedHealer] = useState(null); // Store the selected healer for details view

  const deleteHealer = (id) => {
    setHealers(healers.filter((h) => h.id !== id));
  };

  const startEditing = (healer) => {
    setEditingHealer(healer);
    setShowModal(true); // Show the edit modal
  };

  const updateHealer = (updatedHealer) => {
    setHealers(
      healers.map((h) =>
        h.id === updatedHealer.id ? { ...h, ...updatedHealer } : h
      )
    );
    setShowModal(false); // Close edit modal after update
    setEditingHealer(null);
  };

  const showDetails = (healer) => {
    setSelectedHealer(healer);
    setShowDetailsModal(true); // Show the details modal
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
          {healers.map((healer) => (
            <tr key={healer.id}>
              <td>
                <button className="btn btn-custom btn-sm mx-1" onClick={() => startEditing(healer)}>
                  <FaEdit />
                </button>
                <button onClick={() => deleteHealer(healer.id)} className="btn btn-danger btn-sm mx-1">
                  <FaTrash />
                </button>
              </td>
              <td>{healer.name}</td>
              <td>{healer.phone}</td>
              <td>
                <button className="btn btn-success btn-sm mx-1" onClick={() => showDetails(healer)}>
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing a healer */}
      {showModal && editingHealer && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Healer</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedHealer = {
                  id: editingHealer.id,
                  name: e.target.elements.namedItem("name").value,
                  email: e.target.elements.namedItem("email").value,
                  phone: e.target.elements.namedItem("phone").value,
                };
                updateHealer(updatedHealer);
              }}
            >
              <input
                type="text"
                name="name"
                defaultValue={editingHealer.name}
                className="form-control mb-2"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={editingHealer.email}
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                name="phone"
                defaultValue={editingHealer.phone}
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

      {/* Modal for showing healer details */}
      {showDetailsModal && selectedHealer && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Healer Details</h3>
            <p><strong>Name:</strong> {selectedHealer.name}</p>
            <p><strong>Email:</strong> {selectedHealer.email}</p>
            <p><strong>Phone:</strong> {selectedHealer.phone}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setShowDetailsModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}