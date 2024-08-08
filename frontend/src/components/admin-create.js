import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import './css/bootstrap.css';

export default function AdminCreate() {
    const [form, setForm] = useState({
        userName: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
        role: "admin"
    });
    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj }
        });
    }

	useEffect(() => {
		async function getAccountDetails() {
			const response = await fetch(
				"http://localhost:5001/accountDetails",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if(response.status === 301){
				navigate("/");
				return
			}
			const account = await response.json();
			if (account.username == null) {
				navigate("/");
				return
			}
		}
		getAccountDetails();
	}, [navigate]);
    
    async function onSubmit(e) {
        e.preventDefault();
        const info = { ...form };
        const attempt = await fetch("http://localhost:5001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(info),
            credentials: "include"
        });
        if (!attempt.ok) {
            window.alert("Incorrect user name or password");
            setForm({ userName: "", firstname: "", lastname: "", email: "", phone: "", password: "", role: "admin" });
            console.log("Bad user name or password");
            return;
        }
        setForm({ userName: "", firstname: "", lastname: "", email: "", phone: "", password: "", role: "admin" });
        navigate("/c-account");
    }

    return (
        <div className="container mt-4">
            <h3 className="pt-3">Create Admin Account</h3>
            <form onSubmit={onSubmit}>
                <div className="col-4">
                    <label>User Name:</label>
                    <input 
                        type="text"
                        id="userName"
                        value={form.userName}
                        onChange={(e) => updateForm({ userName: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-4">
                    <label>First Name:</label>
                    <input 
                        type="text"
                        id="firstname"
                        value={form.firstname}
                        onChange={(e) => updateForm({ firstname: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-4">
                    <label>Last Name:</label>
                    <input 
                        type="text"
                        id="lastname"
                        value={form.lastname}
                        onChange={(e) => updateForm({ lastname: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-4">
                    <label>Email:</label>
                    <input 
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-4">
                    <label>Phone:</label>
                    <input 
                        type="text"
                        id="phone"
                        value={form.phone}
                        onChange={(e) => updateForm({ phone: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-4">
                    <label>Password:</label>
                    <input 
                        type="password"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                        className="form-control"
                    />
                </div>
                <br />
                <div className="mx-5">
                    <input 
                        type="submit" 
                        value="Create Administrator"
                        className="btn btn-secondary my-2"
                    />
                </div>
            </form>
        </div>
    );
}
