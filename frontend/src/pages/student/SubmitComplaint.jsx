import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmitComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation

    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    if (title.trim().length < 5) {
      alert("Title must contain at least 5 characters");
      return;
    }

    if (description.trim().length < 10) {
      alert("Description must contain at least 10 characters");
      return;
    }

    try {
      setLoading(true);

      // Get student JWT
      const token = localStorage.getItem("studentToken");

      if (!token) {
        alert("Please login first");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/complaints`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      console.log("Complaint response:", data);

      // Token expired / invalid

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("student");

        alert("Session expired. Please login again.");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (data.success) {
        alert("Complaint submitted successfully!");

        setTitle("");
        setDescription("");

        navigate("/student/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Submit complaint error:", error);

      alert("Unable to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-page">
      <div className="complaint-box">
        <h1>Submit Complaint</h1>

        <form onSubmit={handleSubmit}>
          {/* Title */}

          <div className="form-group">
            <label htmlFor="complaint-title">Complaint Title</label>

            <input
              id="complaint-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter complaint title"
              maxLength="150"
              required
            />
          </div>

          {/* Description */}

          <div className="form-group">
            <label htmlFor="complaint-description">Description</label>

            <textarea
              id="complaint-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your problem"
              rows="6"
              maxLength="2000"
              required
            />
          </div>

          {/* Submit */}

          <button type="submit" disabled={loading}>
            {loading ? "Analyzing & Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
