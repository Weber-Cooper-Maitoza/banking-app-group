import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import './css/bootstrap.css'

export default function Login() {
    const [form, setForm] = useState({
        userName: "",
        password: "",
    });
    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj };
        });
    }

    useEffect(() => {
        async function logout(){
            console.log("logout");
            const response = await fetch(`http://localhost:5001/logout`, {
              method: "GET",
              credentials: "include",
            });
            console.log(response)
        }
        logout()
    }, [])

    async function onSubmit(e) {
        e.preventDefault();
        const info = { ...form };
        const loginInfo = { userName: form.userName, password: form.password}
        const attempt = await fetch("http://localhost:5001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(loginInfo),
        });

        if (!attempt.ok) {
            window.alert("Incorrect user name or password");
            setForm({ userName: "", password: "" });
            console.log("Bad user name or password");
            return;
        }
        
        setForm({ userName: "", password: "" });
        navigate("/c-account");
    }

    return (
        <div className="container mt-4">
            <h3 className="pt-3">Account Login</h3>
            <form onSubmit={onSubmit}>
                <div className="col-3">
                    <label>User Name:</label>
                    <input 
                        type="text"
                        id="userName"
                        value={form.userName}
                        onChange={(e) => updateForm({ userName: e.target.value })}
                        className="form-control"    
                    />
                </div>
                <div className="col-3">
                    <label>Password:</label>
                    <input 
                        type="password"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                        className="form-control"  
                    />
                </div>
                <br/>
                <div className="mx-5">
                    <input 
                        type="submit" 
                        value="Login"
                        className="btn btn-secondary my-2"
                    />
                </div>
            </form>
        </div>
    );
}
