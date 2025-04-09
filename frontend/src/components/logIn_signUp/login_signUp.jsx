import { useState } from "react";
import { useNavigate } from "react-router-dom";  
import "./logIn_signUp.css";

const apiurl = import.meta.env.VITE_API_URL;

function LoginSignup() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userId, setUserId] = useState("");
  const [userGender, setUserGender] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const navigate = useNavigate(); 

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


        if (data.role === "admin") {
          navigate("/DrawerNavAdmin");
        } else if(data.role==="patient") {
          navigate("./DrawerNavPatient");
        }else if (data.role=='doctor'){
          navigate("./DrawerNavDoctor")
        }
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
      userid: userId,
      userGender,
      email,
      password,
    };

    try {
      const response = await fetch(`${apiurl}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User added successfully");
        alert("Account created successfully!");
        setEmail("");
        setUsername("");
        setPassword("");
        setUserGender("");
        setUserId("");
        setIsSignUp(false);
      } else {
        console.log("Failed to add user:", data.error);
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      console.log("Error adding user:", error);
      alert("Something went wrong.");
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
          <select
            className="input"
            value={userGender}
            onChange={(e) => setUserGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
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

      {isSignUp ? (
        <button onClick={addUser} className="btn">Sign Up</button>
      ) : (
        <button onClick={loginUser} className="btn">Log In</button>
      )}
    </div>
  );
}

export default LoginSignup;
