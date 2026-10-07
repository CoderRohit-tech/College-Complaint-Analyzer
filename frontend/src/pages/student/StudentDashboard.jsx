import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {

    const navigate = useNavigate();

    const student = JSON.parse(
        localStorage.getItem("student")
    );


    const handleLogout = () => {

        // Remove student authentication data
        localStorage.removeItem("studentToken");
        localStorage.removeItem("student");

        navigate("/login", {
            replace: true
        });
    };


    return (
        <div className="dashboard">

            <h1>Student Dashboard</h1>

            <h2>
                Welcome, {student?.name || "Student"}
            </h2>


            <div className="dashboard-buttons">

                <button
                    onClick={() =>
                        navigate("/student/submit-complaint")
                    }
                >
                    Submit Complaint
                </button>


                <button
                    onClick={() =>
                        navigate("/student/my-complaints")
                    }
                >
                    My Complaints
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