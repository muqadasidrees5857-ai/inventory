
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    // =========================
    // EMPTY FIELDS
    // =========================

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // =========================
    // ADMIN LOGIN
    // =========================

    const adminPassword =
      localStorage.getItem("adminPassword") ||
      "admin123";

    if (cleanEmail === "admin@gmail.com") {
      if (password !== adminPassword) {
        setError("Invalid admin email or password.");
        return;
      }

      const adminUser = {
        email: "admin@gmail.com",
        role: "admin",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(adminUser)
      );

      // Admin frontend
      window.location.href = "http://localhost:5174/";

      return;
    }

    // =========================
    // REGISTERED USERS
    // =========================

    const registeredUsers =
      JSON.parse(
        localStorage.getItem("registeredUsers")
      ) || [];

    // Find user by email
    const existingUser = registeredUsers.find(
      (user) =>
        user.email.toLowerCase() === cleanEmail
    );

    // User doesn't exist
    if (!existingUser) {
      setError(
        "No account found with this email address."
      );
      return;
    }

    // Wrong password
    if (existingUser.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // =========================
    // USER LOGIN SUCCESS
    // =========================

    const loggedInUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: "user",
    };

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    // Remember me
    if (rememberMe) {
      localStorage.setItem(
        "rememberMe",
        "true"
      );
    } else {
      localStorage.removeItem("rememberMe");
    }

    // Go to user home
    // Go to user home
window.location.href = "/";
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-card">

          {/* Header */}

          <div className="login-header">

            <div className="login-icon">
              <LogIn size={26} />
            </div>

            <h1>Welcome Back</h1>

            <p>
              Login to your Inventory account
            </p>

          </div>

          {/* Form */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* Error */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Email */}

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <Mail
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="email"
                  type="email"
                  className="login-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            {/* Password */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-password-wrapper">

                <Lock
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="login-password-toggle"
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

            {/* Options */}

            <div className="login-options">

              <label className="login-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                Remember me

              </label>

              <Link
                to="/forgot-password"
                className="login-forgot"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>

          {/* Divider */}

          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* Register */}

          <div className="login-register">

            Don't have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
