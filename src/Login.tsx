import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/admin"); // Redirect ke halaman dashboard admin nanti
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-app)",
      color: "var(--text-primary)"
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="login-card"
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img src="/favicon/favicon.svg" alt="Logo" style={{ width: "60px", marginBottom: "15px" }} />
          <h2 style={{ fontFamily: "Impact, sans-serif", fontSize: "24px" }}>ADMIN LOGIN</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>SPPG GARUT SAMARANG</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #eee",
                outline: "none",
                fontSize: "16px"
              }}
              placeholder="admin@gmail.com"
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #eee",
                outline: "none",
                fontSize: "16px"
              }}
              placeholder="••••••••"
            />
          </div>

          {error && <p style={{ color: "red", fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s"
            }}
          >
            {loading ? "Logging in..." : "SIGN IN"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
