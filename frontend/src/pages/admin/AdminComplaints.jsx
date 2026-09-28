import { useEffect, useState } from "react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("adminToken");

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

      console.log(data);

      if (data.success) {
        setComplaints(data.complaints);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

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
      console.log(data);

      if (data.success) {
        alert("Status updated successfully !");
        fetchComplaints();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

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
