import { useEffect, useState } from "react";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/my-complaints", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  return (
    <div className="my-complaints-page">
      <h1>My Complaints</h1>

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
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
