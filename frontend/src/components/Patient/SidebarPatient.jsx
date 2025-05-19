import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaHome, FaComments, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./SidebarPatient.css";
import {
  FaHospital,
  FaStethoscope,
  FaCalendarCheck,
  FaInfoCircle
} from "react-icons/fa";

const SidebarPatient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState("123456789");
  const [name, setName] = useState("Layla Hassan");
  const [email, setEmail] = useState("layla@example.com");
  const [phone, setPhone] = useState("050-1234567");
  const location = useLocation();

  const sidebarRef = useRef(null);
  const toggleRef = useRef(null)
  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleEditSave = () => setEditMode(!editMode);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  return (
    <div className="layout-container">
      <div className="sidebar-patient" ref={sidebarRef}>
      {location.pathname !== "/chat" && (
  <div className="top-bar">
  <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)} ref={toggleRef}>
  <FaBars />
</div>

  {location.pathname === "/profile" && <h2>Patient Profile</h2>}

  {location.pathname === "/appointments" && (
    <div className="appointments-header">
    <h3 className="appointments-title">Upcoming Appointments</h3>
    <div className="appointments-icon-wrapper">
    </div>
     </div>
      )}
       </div>
      )} 

        {isOpen && (
          <ul className="sidebar-links" ref={sidebarRef} >
            <li className={location.pathname === "/profile" ? "active" : ""}>
              <Link to="/profile"><FaHome /> Profile</Link>
            </li>
            <li className={location.pathname === "/chat" ? "active" : ""}>
              <Link to="/chat"><FaComments /> Chat with Bot</Link>
            </li>
            <li className={location.pathname === "/appointments" ? "active" : ""}>
  <Link to="/appointments"><FaCalendarAlt /> My Appointments</Link>
</li>
  
            <li>
              <Link to="/logout"><FaSignOutAlt /> Logout</Link>
            </li>
          </ul>
        
        )}

        <div className="healer-card">
          {location.pathname === "/profile" && (
            <>
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
              document.querySelector('.profile-cover-image').src = imageUrl;
            }
          }}
        />
      )}
    </div>    
              
              <div className="info-row non-editable-id"><strong>ID:</strong> {userId ? userId : "loading..."}</div>
              <div className="info-row"><FaHome className="icon" /> {editMode ? <input value={name} onChange={(e) => setName(e.target.value)} /> : name}</div>
              <div className="info-row"><FaComments className="icon" /> {editMode ? <input value={email} onChange={(e) => setEmail(e.target.value)} /> : email}</div>
              <div className="info-row"><FaCalendarAlt className="icon" /> {editMode ? <input value={phone} onChange={(e) => setPhone(e.target.value)} /> : phone}</div>
              <button className="edit-btn" onClick={handleEditSave}>{editMode ? "Save" : "Edit Profile"}</button>
            </>
          )}

         {location.pathname === "/chat" && (
          <Chatbot
          toggleSidebar={toggleSidebar}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sidebarRef={sidebarRef}
          toggleRef={toggleRef}
  />
)}
         {location.pathname === "/appointments" && (
  <>
    {[
      {
        hospital: "Rambam Medical Center",
        department: "Dermatology",
        date: "2025-04-15 10:30",
        reason: "Skin rash diagnosis",
      },
      {
        hospital: "Hadassah Ein Kerem",
        department: "Cardiology",
        date: "2025-04-18 09:00",
        reason: "Heart rate monitoring",
      },
      {
        hospital: "Sheba Tel Hashomer",
        department: "Orthopedics",
        date: "2025-04-20 14:00",
        reason: "Knee pain consultation",
      },
    ].map((role, index) => (
      <div
        className="info-row"
        key={index}
        style={{ flexDirection: "column", alignItems: "flex-start" }}
      >
        <div>
          <FaHospital className="icon" /> <strong>{role.hospital}</strong>
        </div>
        <div>
          <FaStethoscope className="icon" /> {role.department}
        </div>
        <div>
          <FaCalendarCheck className="icon" /> {role.date}
        </div>
        <div>
          <FaInfoCircle className="icon" /> {role.reason}
        </div>
        <button
          className="cancel-btn"
          onClick={() => alert(`Canceled appointment at ${role.hospital}`)}
        >
          Cancel Appointment
        </button>
      </div>
    ))}
  </>
)}
        </div>
      </div>
    </div>
  );
};

const Chatbot = ({ toggleSidebar , isOpen, setIsOpen, sidebarRef, toggleRef  }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatBodyRef = useRef(null);
  const recognition = useRef(null);


  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = "en-US";

    recognition.current.onstart = () => setIsListening(true);
    recognition.current.onend = () => setIsListening(false);
    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      sendMessage(transcript);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [isOpen]);

  const startListening = () => {
    if (!isListening) {
      try {
        recognition.current.start();
      } catch {
        recognition.current.stop();
        setTimeout(() => recognition.current.start(), 500);
      }
    }
  };

  const sendMessage = (message, sender = "user") => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { text: message, sender }]);
    setUserInput("");
    setTimeout(() => {
      const botReply = getBotReply(message);
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    }, 500);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages((prev) => [...prev, { text: `📂 File uploaded: ${file.name}`, sender: "user" }]);
    }
  };

  const getBotReply = (message) => {
    switch (message) {
      case "Book an appointment": return "Sure! Please provide your preferred date and time.";
      case "Check availability": return "Checking available slots for you...";
      case "Reschedule appointment": return "What date and time would you like to reschedule to?";
      case "Cancel my appointment": return "Are you sure you want to cancel your appointment?";
      default: return "I'm here to help! Please let me know what you need.";
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)} ref={toggleRef}>
       <FaBars className="menu-icon" />
      </div>
        <DotLottieReact
          className="lottie-avatar"
          src="https://lottie.host/092b59c1-8758-4ce2-b688-a71233b80684/ynZHUxEiHy.lottie"
          loop autoplay
        />
        <div className="header-text">Chat with <br /> Chatbot</div>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        <div className="chat-message bot-message">Hello! How can I help you today?</div>
        <div className="quick-buttons">
          {["Book an appointment", "Check availability", "Reschedule appointment", "Cancel appointment"].map((text, index) => (
            <button key={index} onClick={() => sendMessage(text)}>{text}</button>
          ))}
        </div>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}-message`}>{msg.text}</div>
        ))}
      </div>

      <div className="chat-footer">
        <button className="icon-button mic-button" onClick={startListening}>
          <DotLottieReact
            src={
              isListening
                ? "https://lottie.host/929ebd8b-6278-46e2-98ca-5ee5f901f3aa/3gCwPclCZh.lottie"
                : "https://lottie.host/8a3deafc-3242-4846-8803-54ab4b2c77aa/4AXgG4TUjw.lottie"
            }
            loop autoplay
          />
        </button>

        <input type="file" id="fileInput" className="hidden-input" onChange={handleFileUpload} />
        <button className="icon-button file-upload-button" onClick={() => document.getElementById("fileInput").click()}>
          <img src="https://png.pngtree.com/png-clipart/20230313/original/pngtree-add-new-file-icon-transparent-vector-clipart-png-image_8987331.png" alt="Upload" />
        </button>

        <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type your message..." />
        <button className="icon-button send-button" onClick={() => sendMessage(userInput)}>
          <img src="https://w7.pngwing.com/pngs/966/241/png-transparent-white-paper-plane-illustration-telegram-logo-computer-icons-telegram-miscellaneous-blue-angle-thumbnail.png" alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default SidebarPatient;
