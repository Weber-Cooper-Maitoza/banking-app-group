import React, { useState } from "react";
import { useNavigate } from "react-router";
import './css/sb-admin-2.css'

export default function AccountCreate() {
    const [form, setForm] = useState({
        userName: "",
        password: "",
        role: ""
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
        const attempt = await fetch("http://localhost:5001/login", { //
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(info),
            credentials: "include"
        })
        if(!attempt.ok){
            window.alert("Incorrect user name or password");
            setForm({ userName: "", password: "",});
            console.log("Bad user name or password");
            return;
        }
        setForm({ userName: "", Password: "", role:"" });
        //navigate(`/account/${searchName}`);
    }

    

    return (
        <div className= "pt-4 pl-4">
            <h3>Create Account</h3>
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
                        type = "password"
                        id = "password"
                        value={form.password}
                        onChange={(e) => updateForm({password: e.target.value })} 
						className="ml-4"  
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select 
                        id="role"
                        value={form.role}
                        onChange={(e) => updateForm({ role: e.target.value })} 
                        className="ml-4"
                    >
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>
                <br/>
                <div>
                    <input 
						type="submit" 
						value="Create Account"
						className="ml-4"
					/>
                </div>
            </form>
        </div>
    );
}