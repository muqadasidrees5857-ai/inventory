
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    // =========================
    // VALIDATION
    // =========================

    if (
      !cleanEmail ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // =========================
    // ADMIN PASSWORD RESET
    // =========================

    if (cleanEmail === "admin@gmail.com") {
      localStorage.setItem(
        "adminPassword",
        newPassword
      );

      setSuccess(
        "Password reset successfully. You can now login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return;
    }

    // =========================
    // REGISTERED USERS
    // =========================

    const registeredUsers =
      JSON.parse(
        localStorage.getItem("registeredUsers")
      ) || [];

    const userIndex =
      registeredUsers.findIndex(
        (user) =>
          user.email.toLowerCase() ===
          cleanEmail
      );

    // =========================
    // USER NOT FOUND
    // =========================

    if (userIndex === -1) {
      setError(
        "No account found with this email address."
      );
      return;
    }

    // =========================
    // UPDATE PASSWORD
    // =========================

    registeredUsers[userIndex].password =
      newPassword;

    localStorage.setItem(
      "registeredUsers",
      JSON.stringify(registeredUsers)
    );

    setSuccess(
      "Password reset successfully. You can now login."
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="forgot-page">

      <div className="forgot-container">

        <div className="forgot-card">

          {/* Header */}

          <div className="forgot-header">

            <div className="forgot-icon">
              <KeyRound size={27} />
            </div>

            <h1>Forgot Password?</h1>

            <p>
              Reset your password and get back
              into your account.
            </p>

          </div>

          {/* Form */}

          <form
            className="forgot-form"
            onSubmit={handleResetPassword}
          >

            {/* Error */}

            {error && (
              <div className="forgot-error">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="forgot-success">

                <CheckCircle size={17} />

                <span>{success}</span>

              </div>
            )}

            {/* Email */}

            <div className="forgot-field">

              <label htmlFor="forgot-email">
                Email Address
              </label>

              <div className="forgot-input-wrapper">

                <Mail
                  size={18}
                  className="forgot-input-icon"
                />

                <input
                  id="forgot-email"
                  type="email"
                  className="forgot-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            {/* New Password */}

            <div className="forgot-field">

              <label htmlFor="new-password">
                New Password
              </label>

              <div className="forgot-password-wrapper">

                <Lock
                  size={18}
                  className="forgot-input-icon"
                />

                <input
                  id="new-password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  className="forgot-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div className="forgot-field">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="forgot-password-wrapper">

                <Lock
                  size={18}
                  className="forgot-input-icon"
                />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="forgot-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="forgot-password-toggle"
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

            {/* Reset Button */}

            <button
              type="submit"
              className="forgot-btn"
            >
              Reset Password
            </button>

          </form>

          {/* Back to Login */}

          <div className="forgot-back">

            <Link to="/login">

              <ArrowLeft size={17} />

              Back to Login

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;
