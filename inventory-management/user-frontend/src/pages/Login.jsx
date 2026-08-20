
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
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

      // Redirect to Admin Frontend
      window.location.href =
        "https://inventory-s2qj.vercel.app/";

      return;
    }

    // =========================
    // SUPABASE USER LOGIN
    // =========================

    try {
      setLoading(true);

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            password: password,
          }),
        }
      );

      const data = await response.json();

      // =========================
      // BACKEND ERROR
      // =========================

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid email or password."
        );
        return;
      }

      // =========================
      // LOGIN SUCCESS
      // =========================

      const loggedInUser = {
        id: data.user.id,
        name:
          data.user.user_metadata?.name ||
          "",
        email: data.user.email,
        role:
          data.user.user_metadata?.role ||
          "user",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // =========================
      // REMEMBER ME
      // =========================

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem("rememberMe");
      }

      // =========================
      // USER HOME
      // =========================

      window.location.href = "/";

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
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
