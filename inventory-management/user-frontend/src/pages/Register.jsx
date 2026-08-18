
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send registration data to backend
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        setError(
          data.message ||
            "Registration failed. Please try again."
        );
        return;
      }

      // Success
      alert(
        "Account created successfully! Please login."
      );

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">

          {/* Header */}
          <div className="register-header">

            <div className="register-icon">
              <UserPlus size={26} />
            </div>

            <h1>Create Account</h1>

            <p>
              Create your Inventory account
            </p>

          </div>

          {/* Form */}
          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* Error */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="register-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <User
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="name"
                  type="text"
                  className="register-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

            </div>

            {/* Email */}
            <div className="register-field">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <Mail
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="register-email"
                  type="email"
                  className="register-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            {/* Password */}
            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-password-wrapper">

                <Lock
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="register-input"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}
            <div className="register-field">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="register-password-wrapper">

                <Lock
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="register-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="register-btn"
            >
              Create Account
            </button>

          </form>

          {/* Login */}
          <div className="register-login">

            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;
