import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const Navigate = useNavigate();

    const handleSubmit = async(e) =>{
         e.preventDefault();

         try{

            const response = await fetch("http://localhost:5000/api/register", {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },

                body:JSON.stringify({
                    name : name,
                    email : email,
                    password : password
                })
            });

             const data = await response.json();

             if(data.success){
                alert("Registration Successfull");
                Navigate("/login");
             }else{
                alert(data.message);
             }

         }catch(error){
             console.error("Register error:", error);
             alert("Something went wrong");
         }
    }

 
return (
    <div className="login-page">

        <div className="login-box">

            <h2>Create Account</h2>

            <p className="login-subtitle">
                Register as a college student
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                    />
                </div>

                <button
                    className="login-button"
                    type="submit"
                >
                    Create Account
                </button>

            </form>

        </div>

    </div>
);

}
