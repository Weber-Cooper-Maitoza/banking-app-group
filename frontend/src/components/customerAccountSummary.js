import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// import './css/sb-admin-2.css'
import "./css/bootstrap.css";

export default function UserName() {
	// const navigate = useNavigate();

	const [userName, setUserName] = useState();
	const [accessType, setAccess] = useState();

	const [bankAccounts, setBank] = useState([
		{
			accountName: "None",
			amount: 0,
			history: [
				{
					type: "None",
					amount: 0,
					date: Date(1999, 12, 12, 12, 12, 12),
					recipient: "Null",
				},
			],
		},
	]);

	useEffect(() => {
		async function login() {
			console.log("hello");
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
			console.log(login);
			return;
		}
		async function getAccountDetails() {
			const response = await fetch("http://localhost:5001/bankDetails", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const account = await response.json();

			setUserName(account.username);
			setAccess(account.role);
			setBank(account.accounts)
			console.log(account);
		}
		login().then(getAccountDetails);
	}, []);

	return (
		<div className="container-md">
			<p>{userName}</p>

			{bankAccounts.map((account, idx) => {
				return (
					<>
						<h3 className="">
							{account.accountName}
						</h3>
						<table className="table table-striped">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">First</th>
									<th scope="col">Last</th>
									<th scope="col">Date</th>
									<th scope="col">Recipient</th>

								</tr>
							</thead>
							<tbody>
								{account.history.map((history, idx) => (
									<HistoryItem
										history={history}
										idx={idx}
									></HistoryItem>
								))}
							</tbody>
						</table>
					</>
				);
			})}
		</div>
	);
}

function HistoryItem({ history, idx }) {
	// console.log(history)
	const date = new Date(history.date)
	return (
		<>
			<tr>
				<th scope="row">{idx + 1}</th>
				<td>{history.type}</td>
				<td>{history.amount}</td>
				<td>{date.toDateString()}</td>
				<td>{history.recipient}</td>
			</tr>
		</>
	);
}
