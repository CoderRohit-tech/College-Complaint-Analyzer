import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert("Email and password are required");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/login`,
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

            console.log("Student login:", data);


            if (data.success) {

                // Save student JWT
                localStorage.setItem(
                    "studentToken",
                    data.token
                );

                // Save student information
                localStorage.setItem(
                    "student",
                    JSON.stringify(data.student)
                );

                // Go to student dashboard
                navigate("/student/dashboard", {
                    replace: true
                });

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Unable to connect to server");

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="login-page">

            <div className="login-box">

                <h2>Student Login</h2>

                <p className="login-subtitle">
                    Login to manage your college complaints
                </p>


                <form onSubmit={handleSubmit}>

                    {/* Email */}

                    <div className="form-group">

                        <label htmlFor="student-email">
                            Email
                        </label>

                        <input
                            id="student-email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    {/* Password */}

                    <div className="form-group">

                        <label htmlFor="student-password">
                            Password
                        </label>

                        <input
                            id="student-password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    {/* Login */}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>


                    {/* Register */}

                    <button
                        className="register-button"
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Create Account
                    </button>

                </form>

            </div>

        </div>
    );
}