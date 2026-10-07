import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {

        e.preventDefault();


        // Frontend validation

        if (!name.trim() || !email.trim() || !password.trim()) {
            alert("All fields are required");
            return;
        }


        if (name.trim().length < 2) {
            alert("Name must contain at least 2 characters");
            return;
        }


        if (password.length < 6) {
            alert("Password must contain at least 6 characters");
            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password: password
                    })
                }
            );


            const data = await response.json();

            console.log("Register response:", data);


            if (data.success) {

                alert("Registration successful!");

                navigate("/login", {
                    replace: true
                });

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Register error:", error);

            alert("Unable to connect to server");

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="login-page">

            <div className="login-box">

                <h2>Create Account</h2>

                <p className="login-subtitle">
                    Register as a college student
                </p>


                <form onSubmit={handleSubmit}>

                    {/* Name */}

                    <div className="form-group">

                        <label htmlFor="student-name">
                            Name
                        </label>

                        <input
                            id="student-name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your name"
                            required
                        />

                    </div>


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
                            placeholder="Create a password"
                            required
                        />

                    </div>


                    {/* Submit */}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

            </div>

        </div>
    );
}