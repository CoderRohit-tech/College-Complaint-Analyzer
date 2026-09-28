import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {

            const token = localStorage.getItem("adminToken");

            const response = await fetch(
                "http://localhost:5000/api/admin/dashboard",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log(data);

            if (data.success) {
                setDashboard(data.dashboard);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Dashboard error:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div className="dashboard">

            <h1>Admin Dashboard</h1>
            <h2>Welcome, Admin</h2>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Complaints</h3>
                    <p>{dashboard.total}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Pending</h3>
                    <p>{dashboard.pending}</p>
                </div>

                <div className="dashboard-card">
                    <h3>In Progress</h3>
                    <p>{dashboard.in_progress}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Resolved</h3>
                    <p>{dashboard.resolved}</p>
                </div>

            </div>

            <div className="dashboard-buttons">

                <button onClick={() => navigate("/admin/complaints")}>
                    All Complaints
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </div>
    );
}