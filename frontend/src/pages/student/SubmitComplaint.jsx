import { useState } from "react";

export default function SubmitComplaint() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/complaints",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (data.success) {
                alert("Complaint submitted successfully");

                setTitle("");
                setDescription("");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Submit complaint error:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="complaint-page">

            <div className="complaint-box">

                <h1>Submit Complaint</h1>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Complaint Title</label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter complaint title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your problem"
                            rows="5"
                        />
                    </div>

                    <button type="submit">
                        Submit Complaint
                    </button>

                </form>

            </div>

        </div>
    );
}