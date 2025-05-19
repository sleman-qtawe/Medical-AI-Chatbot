import React, { useState, useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./ChatBot.css";

const ChatBot = () => {
  // User state
  const [userId] = useState("67f3f013fc745be78a9e3fc1");
  //const [userId] = useState(localStorage.getItem("userId") || "");

  // Chat state
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Appointment booking state
  const [businesses, setBusinesses] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedTaxonomyId, setSelectedTaxonomyId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState({
    doctorId: null,
    doctorName: null,
    date: null,
    time: null,
    businessId: null,
    taxonomyId: null
  });
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const chatBodyRef = useRef(null);
  const recognition = useRef(null);
  const apiurl = import.meta.env.VITE_API_URL;

  // Initialize speech recognition
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
  }, []);

  // Fetch user appointments on component mount
  useEffect(() => {
    if (userId) {
      fetchUserAppointments();
    }
  }, [userId]);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages((prev) => [
        ...prev,
        { text: `📂 File uploaded: ${file.name}`, sender: "user" },
      ]);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setUserInput("");

    if (text.toLowerCase().includes("book an appointment")) {
      try {
        const response = await fetch(`${apiurl}/businesses`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setBusinesses(data);

        setMessages((prev) => [
          ...prev,
          {
            text: "Please select a department:",
            sender: "bot",
            options: data.map((b) => ({ name: b.name, id: b.id })),
            type: "business",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
        setMessages((prev) => [
          ...prev,
          { text: "❌ Failed to load departments.", sender: "bot" },
        ]);
      }
      return;
    }

    handleBusinessSelection(text);
  };

  const handleBusinessSelection = async (input) => {
    const selected = businesses.find(
      (b) => b.name.toLowerCase() === input.toLowerCase()
    );

    if (selected) {
      setSelectedBusinessId(selected.id);

      try {
        await fetch(`${apiurl}/select-business`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ business_id: selected.id }),
        });

        setMessages((prev) => [
          ...prev,
          { text: `✅ Selected business: ${selected.name}`, sender: "bot" },
        ]);

        await handleFetchCheckups(selected.id);
      } catch (error) {
        console.error("Failed to select business:", error);
        setMessages((prev) => [
          ...prev,
          { text: "❌ Failed to select business", sender: "bot" },
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Business not found", sender: "bot" },
      ]);
    }
  };

  const handleFetchCheckups = async (selected_id) => {
    try {
      const response = await fetch(`${apiurl}/checkups`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: selected_id }),
      });

      const data = await response.json();
      setCheckups(data.checkups || []);

      setMessages((prev) => [
        ...prev,
        {
          text: "📋 Please select a checkup:",
          sender: "bot",
          options: data.checkups.map((checkup, index) => ({
            id: index,
            name: checkup.name,
            taxonomy_id: checkup.id,
          })),
          type: "checkup",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch checkups:", error);
      setMessages((prev) => [
        ...prev,
        { text: "❌ Failed to fetch checkups.", sender: "bot" },
      ]);
    }
  };

  const fetchSlots = async () => {
    if (!selectedBusinessId || !selectedTaxonomyId) {
      alert("Please select a business and checkup first.");
      return;
    }

    setLoadingSlots(true);
    try {
      const response = await fetch(`${apiurl}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          business_id: selectedBusinessId,
          taxonomy_id: selectedTaxonomyId,
        }),
      });

      const data = await response.json();
      setSlots(data.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
    setLoadingSlots(false);
  };

  const fetchUserAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await fetch(`${apiurl}/user-appointments?user_id=${userId}`, {
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoadingAppointments(false);
  };

  const confirmBooking = async () => {
    if (!selectedAppointment.doctorId || !selectedAppointment.date || !selectedAppointment.time) {
      setMessages(prev => [...prev, { 
        text: "Please select a time slot first", 
        sender: "bot" 
      }]);
      return;
    }

    try {
      const bookingData = {
        business_id: selectedBusinessId,
        doctor_id: selectedAppointment.doctorId,
        taxonomy_id: selectedTaxonomyId,
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        user_id: userId
      };

      const response = await fetch(`${apiurl}/book-appointment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Booking failed");
      }

      setMessages(prev => [...prev, { 
        text: `✅ Appointment confirmed with ${selectedAppointment.doctorName} on ${selectedAppointment.date} at ${selectedAppointment.time}`,
        sender: "bot" 
      },
  {
    text: `📄 Appointment Details:\n📅 Date: ${selectedAppointment.date}\n⏰ Time: ${selectedAppointment.time}\n👨‍⚕️ Doctor: ${selectedAppointment.doctorName}\n🏢 Department ID: ${selectedBusinessId}\n🔍 Checkup ID: ${selectedTaxonomyId}`,
    sender: "bot"
  }
]);

      // Reset selection and refresh appointments
      setSelectedAppointment({
        doctorId: null,
        doctorName: null,
        date: null,
        time: null,
        businessId: null,
        taxonomyId: null
      });
      fetchUserAppointments();

    } catch (error) {
      console.error("Booking error:", error);
      setMessages(prev => [...prev, { 
        text: `❌ Failed to book appointment: ${error.message}`,
        sender: "bot" 
      }]);
    }
  };

  const cancelBooking = async (appointmentId) => {
    try {
      const response = await fetch(`${apiurl}/cancel-appointment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          appointment_id: appointmentId,
          user_id: userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Cancellation failed");
      }

      setMessages(prev => [...prev, { 
        text: "✅ Appointment cancelled successfully",
        sender: "bot" 
      }]);
      
      // Refresh appointments after cancellation
      fetchUserAppointments();

    } catch (error) {
      console.error("Cancellation error:", error);
      setMessages(prev => [...prev, { 
        text: `❌ Failed to cancel appointment: ${error.message}`,
        sender: "bot" 
      }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <DotLottieReact
          className="lottie-avatar"
          src="https://lottie.host/092b59c1-8758-4ce2-b688-a71233b80684/ynZHUxEiHy.lottie"
          loop
          autoplay
        />
        <div className="header-text">
          Chat with <br /> Chatbot
        </div>
      </div>

     <div className="chat-body" ref={chatBodyRef}>
  <div className="chat-message bot-message">
    Hello! How can I help you today?
  </div>

  {messages.map((msg, index) => (
    <div key={index} className={`chat-message ${msg.sender}-message`}>
      {msg.text}
      {msg.options && (
        <div className="option-buttons">
          {msg.options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                if (msg.type === "business") {
                  handleBusinessSelection(option.name);
                } else if (msg.type === "checkup") {
                  setSelectedTaxonomyId(option.taxonomy_id);
                  setMessages((prev) => [
                    ...prev,
                    {
                      text: `📝 Selected checkup: ${option.name}`,
                      sender: "user",
                    },
                  ]);
                }
              }}
              className="business-button"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  ))}

  {/* ✅ جدول المواعيد الآن داخل chat-body بعد الرسائل */}
  {selectedBusinessId && selectedTaxonomyId && (
    <div className="p-4">
      <button
        onClick={fetchSlots}
        className="booking-button"
        disabled={loadingSlots}
      >
        {loadingSlots ? "Loading..." : "Get Available Slots"}
      </button>

      <div className="mt-4">
        {slots.map((doctor) => (
          <div key={doctor.doctor_id} className="mb-4 p-4 border rounded bg-white">
            <h2 className="font-bold text-lg mb-2">{doctor.doctor_name}</h2>

            {doctor.slots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {doctor.slots.map((slot, index) => {
                  const dateTime = `${slot.date} at ${slot.time}`;
                  const isSelected = selectedAppointment.date === slot.date &&
                    selectedAppointment.time === slot.time;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedAppointment({
                          doctorId: doctor.doctor_id,
                          doctorName: doctor.doctor_name,
                          date: slot.date,
                          time: slot.time,
                          businessId: selectedBusinessId,
                          taxonomyId: selectedTaxonomyId
                        });
                        setMessages(prev => [
                          ...prev,
                          {
                            text: `📅 Selected appointment with ${doctor.doctor_name} on ${slot.date} at ${slot.time}`,
                            sender: "user",
                          },
                        ]);
                      }}
                      className={`px-3 py-1 rounded-lg border ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-blue-200"}`}
                    >
                      {dateTime.replace(" at ", " | ")}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-red-600">No available slots.</p>
            )}

            {selectedAppointment.doctorId === doctor.doctor_id && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={confirmBooking}
                  className="booking-button"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => {
                    setSelectedAppointment({
                      doctorId: null,
                      doctorName: null,
                      date: null,
                      time: null,
                      businessId: null,
                      taxonomyId: null
                    });
                    setMessages(prev => [
                      ...prev,
                      { text: "Appointment selection cancelled", sender: "user" },
                    ]);
                  }}
                  className="booking-button"
                >
                  Cancel Selection
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

        <div className="mt-8">
          
          {loadingAppointments ? (
            <p>Loading appointments...</p>
          ) : userAppointments.length > 0 ? (
            <div className="space-y-4">
              {userAppointments.map(appointment => (
                <div key={appointment._id} className="p-4 border rounded bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{appointment.doctor_name}</p>
                      <p>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                      <p className={`text-sm ${
                        appointment.status === 'confirmed' ? 'text-green-600' : 
                        appointment.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        Status: {appointment.status}
                      </p>
                    </div>
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => cancelBooking(appointment._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
           ) : (
            <p>No appointments booked yet.</p>
          )}
        </div>
        
        <div className="chat-footer">
          <button className="icon-button mic-button" onClick={startListening}>
            <DotLottieReact
              src={
                isListening
                  ? "https://lottie.host/929ebd8b-6278-46e2-98ca-5ee5f901f3aa/3gCwPclCZh.lottie"
                  : "https://lottie.host/8a3deafc-3242-4846-8803-54ab4b2c77aa/4AXgG4TUjw.lottie"
              }
              loop
              autoplay
            />
          </button>

          <input
            type="file"
            id="fileInput"
            className="hidden-input"
            onChange={handleFileUpload}
          />

          <button
            className="icon-button file-upload-button"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <img
              src="https://png.pngtree.com/png-clipart/20230313/original/pngtree-add-new-file-icon-transparent-vector-clipart-png-image_8987331.png"
              alt="Upload"
            />
          </button>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
          />

          <button
            className="icon-button send-button"
            onClick={() => sendMessage(userInput)}
          >
            <img
              src="https://w7.pngwing.com/pngs/966/241/png-transparent-white-paper-plane-illustration-telegram-logo-computer-icons-telegram-miscellaneous-blue-angle-thumbnail.png"
              alt="Send"
            />
          </button>
        </div>
      </div>
  );
};

export default ChatBot;