import React, { useState } from "react";
import { useNavigate } from "react-router";
import './css/sb-admin-2.css'

export default function Login() {
    const [form, setForm] = useState({
        userName: "",
        password: "",
    });
    const navigate = useNavigate();
    const searchName = form.userName;

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj}
        });
    }

    async function onSubmit(e){
        
        e.preventDefault();
        const info = {...form};
        const attempt = await fetch("http://localhost:5001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(info),
            credentials: "include"
        })
        if(!attempt.ok){
            window.alert("Incorrect user name or password");
            setForm({ userName: "", Password: "" });
            console.log("Bad user name or password");
            return;
        }
        setForm({ userName: "", Password: "" });
        //navigate(`/account/${searchName}`);
    }

    

    return (
        <div className= "pt-4 pl-4">
            <h3>Account Login</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>User Name:</label>
                    <input 
                        type = "text"
                        id = "userName"
                        value={form.userName}
                        onChange={(e) => updateForm({userName: e.target.value })}
						className="ml-2"    
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type = "text"
                        id = "password"
                        value={form.password}
                        onChange={(e) => updateForm({password: e.target.value })} 
						className="ml-4"  
                    />
                </div>
                <br/>
                <div>
                    <input 
						type="submit" 
						value="Login"
						className="ml-4"
					/>
                </div>
            </form>
        </div>
    );
}