import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import "./css/bootstrap.css";

export default function CustomerSearch() {
	const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [customerID, setCustomerID] = useState("");


  //TODO:
  // Where the employee will be taken after logged in, 
  // must be logged in to view 


	useEffect(() => {
    // FIXME: eventually remove this.
		async function run() {
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

      const result = await fetch(`http://localhost:5001/accountDetails`, 
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      const response = await result.json();
      if (response.role == 'customer') {
        navigate("/login");
      } 
      setUserName(response.username);
      setRole(response.role);
		}

    run();
	}, []);

  function submitCustomerSearch(e) {
		e.preventDefault();
    console.log("submitted")
    // TODO: enters a customer id to search for customer, 
    // if not found displays a no customer found message 
    // TODO: check if there is a customer ID that fits.
    // then take them to the customer over page.
  }

	return (
		<div className="container-md mt-3">
			<div className="col">
				<h3 className="col">Welcome {userName}</h3>
				<h4 className="col text-secondary">
					Role: {role}
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
						// onChange={(e) => {
						// 	// setType(e.target.value);
						// }}
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
    </div>
	);
}
