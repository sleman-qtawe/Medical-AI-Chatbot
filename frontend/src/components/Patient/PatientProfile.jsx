import React, { useState } from "react";
import { FaHome, FaComments, FaCalendarAlt } from "react-icons/fa";
import "./PatientProfile.css"; 

const PatientProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [userId] = useState("123456789");
  const [name, setName] = useState("Layla Hassan");
  const [email, setEmail] = useState("layla@example.com");
  const [phone, setPhone] = useState("050-1234567");

  const handleEditSave = () => setEditMode(!editMode);

  return (
    <div className="healer-card">
      <h3 className="profile-greeting">Welcome, {name.split(" ")[0]}!</h3>

      <div className="profile-image-section">
        <img
          className="profile-cover-image"
          src="https://blog.medicalgps.com/wp-content/uploads/2019/01/empathy2.jpg"
          alt="Profile Cover"
        />
        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                document.querySelector(".profile-cover-image").src = imageUrl;
              }
            }}
          />
        )}
      </div>

      <div className="info-row non-editable-id">
        <strong>ID:</strong> {userId ? userId : "loading..."}
      </div>
      <div className="info-row">
        <FaHome className="icon" />
        {editMode ? (
          <input value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          name
        )}
      </div>
      <div className="info-row">
        <FaComments className="icon" />
        {editMode ? (
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          email
        )}
      </div>
      <div className="info-row">
        <FaCalendarAlt className="icon" />
        {editMode ? (
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        ) : (
          phone
        )}
      </div>
      <button className="edit-btn" onClick={handleEditSave}>
        {editMode ? "Save" : "Edit Profile"}
      </button>
    </div>
  );
};

export default PatientProfile;