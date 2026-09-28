import React from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>

       <h2>Welcome, {student?.name}</h2>

      <div className="dashboard-buttons">
      <button onClick={() => navigate("/student/submit-complaint")}>
        Submit Complaint
      </button>

      <button onClick={() => navigate("/student/my-complaints")}>
        My Complaints
      </button>

      <button onClick={handleLogout}>Logout</button>

      </div>
    </div>
  );
}
