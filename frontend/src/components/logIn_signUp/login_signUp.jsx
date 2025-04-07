import { useState } from "react";
import "./logIn_signUp.css";
const apiurl = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

function LoginSignup() {
  const navigate = useNavigate(); 
  const [isSignUp, setIsSignUp] = useState(false);
  const [userId, setUserId] = useState("");
  const [userGender, setUserGender] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  };

  const loginUser = async () => {
    try {
      const response = await fetch(`${apiurl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data);
        
        setIsAuthenticated(true);
  
        navigate("/dashboard");
      } else {
        console.log("Login failed:", data.error);
        alert(data.error);
      }
    } catch (error) {
      console.log("Error logging in:", error);
      alert("An error occurred while logging in.");
    }
  };
  
  
  const addUser = async () => {
    const newUser = {
      username,
      userId,
      userGender,
      email,
      password,
    };

    try {
      const response = await fetch(`${apiurl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log("User added successfully");
        setEmail("");
        setUsername("");
        setPassword("");
        setUserGender("");
        setUserId("");
        setIsSignUp(false);
      } else {
        console.log("Failed to add user");
      }
    } catch (error) {
      console.log("Error adding user:", error);
    }
  };

  return (
    <div className="container">
      <div className="nav">
        <button 
          className={`nav-btn ${!isSignUp ? "active" : ""}`} 
          onClick={() => setIsSignUp(false)}
        >
          Log In
        </button>
        <button 
          className={`nav-btn ${isSignUp ? "active" : ""}`} 
          onClick={() => setIsSignUp(true)}
        >
          Sign Up
        </button>
      </div>

      <h2>{isSignUp ? "Create an Account" : "Welcome Back"}</h2>

      {isSignUp && (
        <>
          <input
            type="text"
            className="input"
            placeholder="ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Gender"
            value={userGender}
            onChange={(e) => setUserGender(e.target.value)}
          />
        </>
      )}

      <input
        type="email"
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={isSignUp ? addUser : loginUser} className="btn">
        {isSignUp ? "Sign Up" : "Log In"}
      </button>
    </div>
  );
}

export default LoginSignup;
