import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import "./css/bootstrap.css";

export default function CustomerSearch() {
	// const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [customerID, setCustomerID] = useState("");

	// const [bankAccounts, setBank] = useState([
	// 	{
	// 		accountName: "None",
	// 		amount: 0,
	// 		history: [
	// 			{
	// 				type: "None",
	// 				amount: 0,
	// 				date: Date(1999, 12, 12, 12, 12, 12),
	// 				recipient: "Null",
	// 			},
	// 		],
	// 	},
	// ]);

	// useEffect(() => {
	// 	async function login() {
	// 		console.log("hello");
	// 		const login = await fetch(`http://localhost:5001/login`, {
	// 			method: "POST",
	// 			credentials: "include",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				username: "Bob",
	// 			}),
	// 		});
	// 		console.log(login);
	// 		return;
	// 	}
	// 	async function getAccountDetails() {
	// 		const response = await fetch("http://localhost:5001/bankDetails", {
	// 			method: "POST",
	// 			credentials: "include",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	// 		const account = await response.json();

	// 		setUserName(account.username);
	// 		setAccess(account.role);
	// 		setBank(account.accounts);
	// 		console.log(account);
	// 	}
	// 	login().then(getAccountDetails);
	// }, []);
  function submitCustomerSearch(e) {
		e.preventDefault();
    console.log("submitted")
  }

	return (
		<div className="container-md mt-3">
			<div className="col">
				<h3 className="col">Welcome {userName}</h3>
				<h4 className="col text-secondary">
					Role: {" "}
				</h4>
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
						placeholder="[put placeholder here]"
						value={customerID}
						onChange={(e) => {
							// setType(e.target.value);
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
						// disabled={amount === ""}
					>
						Submit
					</button>
				</div>
			</form>
			</div>
    </div>
	);
}
