import React, { useState, useRef, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatBodyRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log("Speech recognition not supported in this browser.");
      return;
    }

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = false; // Stops after user finishes speaking
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
      } catch (error) {
        console.error("Speech recognition failed to start:", error);
        recognition.current.stop();
        setTimeout(() => recognition.current.start(), 500); // إعادة المحاولة بعد نصف ثانية
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
      case "Book an appointment":
        return "Sure! Please provide your preferred date and time.";
      case "Check availability":
        return "Checking available slots for you...";
      case "Reschedule appointment":
        return "What date and time would you like to reschedule to?";
      case "Cancel my appointment":
        return "Are you sure you want to cancel your appointment?";
      default:
        return "I'm here to help! Please let me know what you need.";
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
        <div className="header-text">Chat with<br />Chatbot</div>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        <div className="chat-message bot-message">
          Hello! How can I help you today?
        </div>

        <div className="quick-buttons">
          {["Book an appointment", "Check availability", "Reschedule appointment", "Cancel appointment"].map((text, index) => (
            <button key={index} onClick={() => sendMessage(text)}>
              {text}
            </button>
          ))}
        </div>

        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}-message`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <button className="icon-button mic-button" onClick={startListening}>
          <DotLottieReact
            src={isListening 
              ? "https://lottie.host/929ebd8b-6278-46e2-98ca-5ee5f901f3aa/3gCwPclCZh.lottie"  // ميكروفون يعمل (متغير)
              : "https://lottie.host/8a3deafc-3242-4846-8803-54ab4b2c77aa/4AXgG4TUjw.lottie"}  // ميكروفون عادي
            loop
            autoplay
          />
        </button>

        <input type="file" id="fileInput" className="hidden-input" onChange={handleFileUpload} />
        <button className="icon-button file-upload-button" onClick={() => document.getElementById("fileInput").click()}>
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
        <button className="icon-button send-button" onClick={() => sendMessage(userInput)}>
          <img
            src="https://w7.pngwing.com/pngs/966/241/png-transparent-white-paper-plane-illustration-telegram-logo-computer-icons-telegram-miscellaneous-blue-angle-thumbnail.png"
            alt="Send"
          />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
