import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (data.success) {

                localStorage.setItem(
                    "adminToken",
                    data.token
                );

                navigate("/admin/dashboard");

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Login error:", error);
            alert("Something went wrong!");

        }
    };

    return (
        <div className="login-page">

            <div className="login-box">

                <h1>Admin Login</h1>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter admin email"
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />

                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}