import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {

        e.preventDefault();

        // Basic validation
        if (!email.trim() || !password.trim()) {
            alert("Email and password are required");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );


            const data = await response.json();

            console.log("Admin login:", data);


            if (data.success) {

                // Save admin JWT
                localStorage.setItem(
                    "adminToken",
                    data.token
                );

                // Go to admin dashboard
                navigate("/admin/dashboard", {
                    replace: true
                });

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Admin login error:", error);

            alert("Unable to connect to server");

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="login-page">

            <div className="login-box">

                <h1>Admin Login</h1>


                <form onSubmit={handleSubmit}>

                    {/* Email */}

                    <div className="form-group">

                        <label htmlFor="admin-email">
                            Email
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter admin email"
                            required
                        />

                    </div>


                    {/* Password */}

                    <div className="form-group">

                        <label htmlFor="admin-password">
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            required
                        />

                    </div>


                    {/* Login button */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}