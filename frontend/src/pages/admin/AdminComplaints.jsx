import { useEffect, useState } from "react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Fetch all complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin login required");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/complaints",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Complaints:", data);

      if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (data.success) {
        setComplaints(data.complaints);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Fetch complaints error:", error);
      alert("Unable to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin login required");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/complaints/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: status,
          }),
        },
      );

      const data = await response.json();

      console.log("Update response:", data);

      if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (data.success) {
        alert("Status updated successfully!");
        fetchComplaints();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Unable to update status");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="admin-complaints-page">
        <h1>All Complaints</h1>
        <p>Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="admin-complaints-page">
      <h1>All Complaints</h1>

      {complaints.length === 0 ? (
        <p className="no-complaints">No complaints found.</p>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div className="complaint-card" key={complaint.id}>
              <h2>{complaint.title}</h2>

              <p>
                <strong>Description:</strong> {complaint.description}
              </p>

              <p>
                <strong>Category:</strong> {complaint.category}
              </p>

              <p>
                <strong>Sentiment:</strong> {complaint.sentiment}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                <span
                  className={`priority-${complaint.priority?.toLowerCase()}`}
                >
                  {complaint.priority}
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    complaint.status === "Pending"
                      ? "status-pending"
                      : complaint.status === "In Progress"
                        ? "status-progress"
                        : "status-resolved"
                  }
                >
                  {complaint.status}
                </span>
              </p>

              <div className="status-buttons">
                <button
                  onClick={() => updateStatus(complaint.id, "In Progress")}
                >
                  In Progress
                </button>

                <button onClick={() => updateStatus(complaint.id, "Resolved")}>
                  Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
