import { useEffect, useState } from "react";

export default function MyComplaints() {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchComplaints();
    }, []);


    const fetchComplaints = async () => {

        try {

            const token = localStorage.getItem("studentToken");


            if (!token) {
                alert("Please login first");
                return;
            }


            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/my-complaints`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();

            console.log("My complaints:", data);


            // Token expired or invalid
            if (response.status === 401 || response.status === 403) {

                localStorage.removeItem("studentToken");
                localStorage.removeItem("student");

                alert("Session expired. Please login again.");

                window.location.href = "/login";

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


    if (loading) {

        return (
            <div className="my-complaints-page">

                <h1>My Complaints</h1>

                <p>Loading complaints...</p>

            </div>
        );
    }


    return (
        <div className="my-complaints-page">

            <h1>My Complaints</h1>


            {complaints.length === 0 ? (

                <p className="no-complaints">
                    No complaints found.
                </p>

            ) : (

                <div className="complaints-list">

                    {complaints.map((complaint) => (

                        <div
                            className="complaint-card"
                            key={complaint.id}
                        >

                            <h2>
                                {complaint.title}
                            </h2>


                            <p>
                                <strong>
                                    Description:
                                </strong>{" "}
                                {complaint.description}
                            </p>


                            <p>
                                <strong>
                                    Category:
                                </strong>{" "}
                                {complaint.category}
                            </p>


                            <p>
                                <strong>
                                    Sentiment:
                                </strong>{" "}
                                {complaint.sentiment}
                            </p>


                            <p>
                                <strong>
                                    Priority:
                                </strong>{" "}

                                <span
                                    className={`priority-${complaint.priority?.toLowerCase()}`}
                                >
                                    {complaint.priority || "Medium"}
                                </span>
                            </p>


                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}

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


                            {complaint.summary && (

                                <p>
                                    <strong>
                                        AI Summary:
                                    </strong>{" "}
                                    {complaint.summary}
                                </p>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}