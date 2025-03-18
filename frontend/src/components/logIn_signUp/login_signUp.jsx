import { useState } from "react";
import "./logIn_signUp.css";

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userId, setUserId] = useState("");
  const [userGender, setUserGender] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = () => {
    if (isSignUp) {
      console.log("Signing Up:", { userId,username,userGender, email, password });
    } else {
      console.log("Logging In:", { email, password });
    }
  };

  return (
    <div className="container">
      {/* Navigation Bar with Buttons */}
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

      {/* Sign Up only shows the Username field */}
      {isSignUp && (
  <>
    <input
      type="number"
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

    
   {/* Login shows the Email and Password fields */}


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

      <button onClick={handleAuth} className="btn">
        {isSignUp ? "Sign Up" : "Log In"}
      </button>
    </div>
  );
}

export default App;
