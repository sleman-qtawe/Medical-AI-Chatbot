import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaHospital, FaStethoscope, FaCalendarCheck, FaInfoCircle, FaHome, FaComments, FaCalendarAlt } from "react-icons/fa";
import "./ChatBot.css";

const ChatBot = () => {
  const [editMode, setEditMode] = useState(false);
  const [userId] = useState("123456789");
  const [name, setName] = useState("Layla Hassan");
  const [email, setEmail] = useState("layla@example.com");
  const [phone, setPhone] = useState("050-1234567");
  const location = useLocation();

  const handleEditSave = () => setEditMode(!editMode);
  const apiurl = import.meta.env.VITE_API_URL;

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
  }, []);

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

  const sendMessage = async (message, sender = "user") => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { text: message, sender }]);
    setUserInput("");

    try {
      // Wait for the bot's response
      const botReply = await getBotReply(message);

      // إذا كانت الإجابة تحتوي على قائمة من الأقسام أو خيارات أخرى
      if (botReply.includes("الأعمال المتاحة هي:")) {
        const businessNames = botReply.replace("الأعمال المتاحة هي: ", "").split(", ");
        const businessButtons = businessNames.map((business, index) => (
          <button key={index} className="business-button" onClick={() => handleBusinessClick(business)}>
            {business}
          </button>
        ));
        setMessages((prev) => [
          ...prev,
          { text: businessButtons, sender: "bot" },
        ]);
      } else {
        // إذا كانت الإجابة نصية عادية
        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error while getting bot reply:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't get a reply.", sender: "bot" },
      ]);
    }
  };

  const getBotReply = async (message) => {
    try {
      const response = await fetch(`${apiurl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
  
      // Log the raw response for debugging
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      const textResponse = await response.text();  // Get the raw text response
      console.log("Raw Response:", textResponse);  // Log it to see the HTML or error message
  
      if (response.ok) {
        try {
          const data = JSON.parse(textResponse);  // Try parsing the JSON manually
          return data.response || "Sorry, I couldn't understand.";
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          return "Error: Received non-JSON response.";
        }
      } else {
        return `Error: ${response.statusText}`;
      }
    } catch (error) {
      console.error("Error communicating with Gemini backend:", error);
      return "Error contacting server.";
    }
  };
  
  

  const handleBusinessClick = (business) => {
    // عند الضغط على الزر، نقوم بإرسال الرسالة إلى الـ Chat
    sendMessage(business);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages((prev) => [...prev, { text: `📂 File uploaded: ${file.name}`, sender: "user" }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
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
          <div key={index} className={`chat-message ${msg.sender}-message`}>
            {Array.isArray(msg.text) ? msg.text : msg.text}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <button className="icon-button mic-button" onClick={startListening}>
          <DotLottieReact
            src={isListening
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

export default ChatBot;
