import { useState } from "react";
import "./AddUser.css";

export default function AddUser() {
  const [role, setRole] = useState("doctor");
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // After submitting the form, show the success message
    setShowSuccessMessage(true);

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Function to handle role change and reset inputs
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Reset input fields when the role changes
    setInputs({
      name: "",
      email: "",
      phone: "",
      specialty: newRole === "doctor" ? "" : "", // Reset specialty field
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add User</h2>

      {/* Choose user role */}
      <div className="mb-3">
        <button
          className={`btn mx-1 ${role === "doctor" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleRoleChange("doctor")}
        >
          Doctor
        </button>
        <button
          className={`btn mx-1 ${role === "therapist" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleRoleChange("therapist")}
        >
          Therapist
        </button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="alert alert-success" role="alert">
          User added successfully!
        </div>
      )}

      <form className="card p-4 shadow" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="form-control mb-2"
          value={inputs.name}
          onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={inputs.email}
          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="form-control mb-2"
          value={inputs.phone}
          onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
        />

        {/* Input for doctors only */}
        {role === "doctor" && (
          <div className="specialty-input show">
            <input
              type="text"
              placeholder="Specialty"
              className="form-control mb-2"
              value={inputs.specialty}
              onChange={(e) => setInputs({ ...inputs, specialty: e.target.value })}
            />
          </div>
        )}

        <button className="btn btn-success w-100 mt-2">Add</button>
      </form>
    </div>
  );
}
