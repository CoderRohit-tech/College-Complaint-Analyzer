import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("student", JSON.stringify(data.student));

        navigate("/student/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

 
return (
    <div className="login-page">

        <div className="login-box">

            <h2>Student Login</h2>
            <p className="login-subtitle">
                Login to manage your college complaints
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    className="login-button"
                    type="submit"
                >
                    Login
                </button>

                <button
                    className="register-button"
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Create Account
                </button>

            </form>

        </div>

    </div>
);

}
