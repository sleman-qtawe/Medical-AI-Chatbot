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
  const [phone, setPhone] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiurl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login response:", data);
        setCurrentUser(data.user);
        
        if (data.verified === false) {
          // Use the phone number from the response
          setPhone(data.user.phone);
          setIsOtpModalOpen(true);
        } else {
          handleSuccessfulLogin(data);
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred while logging in.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiurl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, code: otp }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccessfulLogin(data);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (error) {
      setError("OTP verification failed");
      console.error("OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setIsAuthenticated(true);
    setIsOtpVerified(true);
    setIsOtpModalOpen(false);
    navigateBasedOnRole(data.user.role);
  };

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "patient":
        navigate("/patient");
        break;
      case "doctor":
        navigate("/doctor");
        break;
      default:
        setError("Unknown user role");
    }
  };

  const addUser = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiurl}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          userid: userId,
          userGender,
          email,
          password,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        resetForm();
        setIsSignUp(false);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUserId("");
    setUsername("");
    setEmail("");
    setPassword("");
    setUserGender("");
    setPhone("");
  };

  return (
    <div className="container">
      <div className="nav">
        <button
          className={`nav-btn ${!isSignUp ? "active" : ""}`}
          onClick={() => setIsSignUp(false)}
          disabled={isLoading}
        >
          Log In
        </button>
        <button
          className={`nav-btn ${isSignUp ? "active" : ""}`}
          onClick={() => setIsSignUp(true)}
          disabled={isLoading}
        >
          Sign Up
        </button>
      </div>

      <h2>{isSignUp ? "Create an Account" : "Welcome Back"}</h2>

      {error && <div className="error-message">{error}</div>}

      {isSignUp && (
        <>
          <input
            type="text"
            className="input"
            placeholder="ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="text"
            className="input"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="tel"
            className="input"
            placeholder="Phone (e.g. +972...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />
          <select
            className="input"
            value={userGender}
            onChange={(e) => setUserGender(e.target.value)}
            disabled={isLoading}
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
        disabled={isLoading}
      />

      <input
        type="password"
        className="input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      {isSignUp ? (
        <button onClick={addUser} className="btn" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      ) : (
        <button onClick={loginUser} className="btn" disabled={isLoading}>
          {isLoading ? "Logging In..." : "Log In"}
        </button>
      )}

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="otp-modal">
          <div className="modal-content">
            <h3>Enter OTP</h3>
            <p>We've sent a verification code to {phone}</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="input"
              disabled={isLoading}
            />
            {error && <div className="error-message">{error}</div>}
            <div className="modal-buttons">
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="btn secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                className="btn"
                disabled={isLoading || !otp}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginSignup;