import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Login() {
	const navigate = useNavigate();
    // FIXME: eventually remove this.
	async function login() {
		const login = await fetch(`http://localhost:5001/login`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: "Bob",
			}),
		});
		alert("logged in.")
		navigate("/c-account");
	}

	return (
		<div>
      <p>TODO: Create login. </p>
			<p>auto loging in as bob</p>
			<button
						type="submit"
						className="btn btn-secondary my-2"
						onClick={login}
					>
						login
					</button>
		</div>
	);
}