import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function NavBar() {
	const navigate = useNavigate();
	const [role, setRole] = useState("");

	useEffect(() => {
		async function checkRole() {
			const result = await fetch(`http://localhost:5001/accountDetails`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if(result.status === 301){
				setRole("")
				return
			}
			const response = await result.json();
			setRole(response.role);
			return;
		}
		checkRole();
	}, [navigate]);

	async function logout() {
		console.log("logout");
		const response = await fetch(`http://localhost:5001/logout`, {
			method: "GET",
			credentials: "include",
		});
    	console.log(response)
		navigate("/");
	}

	function areTheyEmployee() {
		if (role === "employee" || role === "administrator") {
			return "";
		}
		return "invisible";
	}
	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<a className="navbar-brand px-3" href="c-account">
					TBD's Banking App
				</a>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className={`nav-item active`}>
							<a className="nav-link" href="/c-account">
								Home
							</a>
						</li>
						<li className={`nav-item ${areTheyEmployee()}`}>
							<a className="nav-link" href="/e-customer-search">
								Search User
							</a>
						</li>
						<li className={`nav-item ${areTheyEmployee()}`}>
							<a className="nav-link" href="/createAdmin">
								Create Admin
							</a>
						</li>
						<li className={`nav-item ${areTheyEmployee()}`}>
							<a className="nav-link" href="/createAccount">
								Create Account
							</a>
						</li>
					</ul>
				</div>
				<ul className="navbar-nav mx-3">
					<div className="me-1">
						{!role ? (
							<li className="nav-item">
								<a
									className={`btn btn-primary btn-sm`}
									href="/"
								>
									Login
								</a>
							</li>
						) : (
							<li className="nav-item">
								<button
									type="button"
									className={`btn btn-danger btn-sm`}
									onClick={logout}
								>
									Logout
								</button>
							</li>
						)}
					</div>
				</ul>
			</nav>
		</>
	);
}

export default NavBar;
