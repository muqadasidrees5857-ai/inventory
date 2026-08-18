
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

  const handleRegister = (e) => {
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
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check existing users
    const existingUsers =
      JSON.parse(
        localStorage.getItem("registeredUsers")
      ) || [];

    const userExists = existingUsers.some(
      (user) =>
        user.email.toLowerCase() ===
        email.toLowerCase()
    );

    if (userExists) {
      setError(
        "An account with this email already exists."
      );
      return;
    }

    // Create user
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
      role: "user",
    };

    existingUsers.push(newUser);

    localStorage.setItem(
      "registeredUsers",
      JSON.stringify(existingUsers)
    );

    // Success message
    alert(
      "Account created successfully! Please login."
    );

    navigate("/login");
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

