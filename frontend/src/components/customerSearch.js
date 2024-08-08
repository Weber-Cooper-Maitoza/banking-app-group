import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import "./css/bootstrap.css";

export default function CustomerSearch() {
	const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [customerID, setCustomerID] = useState("");

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

  async function submitCustomerSearch(e) {
		e.preventDefault();
		const responseJson = await fetch(`http://localhost:5001/checkCustomerID/${customerID}`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const result = await responseJson.json();
		if (!result.check) {
			window.alert("Could not find user.");
		} else {
			navigate("/e-customer-account");
		}
  }

	return (
		<div className="container-md mt-3">
				<h2 className="mt-4">Search For Customer</h2>
				<form className="row mb-3">
					<div className="col">
						<label for="customerIDSearch" className="form-label">
							Customer ID:
						</label>
						<input
							type="text"
							id="customerIDSearch"
							className="form-control"
							placeholder="ID"
							value={customerID}
							onChange={(e) => {
								setCustomerID(e.target.value);
							}}
						>
						</input>
					</div>
					<div className="col">
						<br></br>
						<button
							type="submit"
							className="btn btn-secondary my-2"
							onClick={submitCustomerSearch}
						>
							Submit
						</button>
					</div>
				</form>
    </div>
	);
}
