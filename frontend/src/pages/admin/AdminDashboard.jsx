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

    const [loading, setLoading] = useState(true);


    // Fetch dashboard data
    useEffect(() => {
        fetchDashboard();
    }, []);


    const fetchDashboard = async () => {

        try {

            const token = localStorage.getItem("adminToken");

            // Check token
            if (!token) {
                navigate("/admin/login", { replace: true });
                return;
            }


            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/dashboard`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();

            console.log("Dashboard:", data);


            // Token expired / invalid
            if (response.status === 401 || response.status === 403) {

                localStorage.removeItem("adminToken");

                alert("Session expired. Please login again.");

                navigate("/admin/login", { replace: true });

                return;
            }


            if (data.success) {

                setDashboard(data.dashboard);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Dashboard error:", error);

            alert("Unable to load dashboard");

        } finally {

            setLoading(false);

        }
    };


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("adminToken");

        navigate("/admin/login", { replace: true });

    };


    // Loading screen
    if (loading) {

        return (
            <div className="dashboard">

                <h1>Admin Dashboard</h1>

                <p>Loading dashboard...</p>

            </div>
        );

    }


    return (
        <div className="dashboard">

            <h1>Admin Dashboard</h1>

            <h2>Welcome, Admin</h2>


            {/* Dashboard Cards */}

            <div className="dashboard-cards">

                {/* Total */}

                <div className="dashboard-card">

                    <h3>Total Complaints</h3>

                    <p>{dashboard.total}</p>

                </div>


                {/* Pending */}

                <div className="dashboard-card">

                    <h3>Pending</h3>

                    <p>{dashboard.pending}</p>

                </div>


                {/* In Progress */}

                <div className="dashboard-card">

                    <h3>In Progress</h3>

                    <p>{dashboard.in_progress}</p>

                </div>


                {/* Resolved */}

                <div className="dashboard-card">

                    <h3>Resolved</h3>

                    <p>{dashboard.resolved}</p>

                </div>

            </div>


            {/* Buttons */}

            <div className="dashboard-buttons">

                <button
                    onClick={() => navigate("/admin/complaints")}
                >
                    All Complaints
                </button>


                <button
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}