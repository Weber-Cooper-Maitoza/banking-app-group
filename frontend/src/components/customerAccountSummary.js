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
			setBank(account.accounts);
			console.log(account);
		}
		login().then(getAccountDetails);
	}, []);

	function showTable(e) {
		console.log(e);
	}

	return (
		<div className="container-md mt-3">
			<h2>Welcome {userName}</h2>
			{bankAccounts.map((account, idx) => {
				return (
					<div className="container-fluid my-3">
						<History account = {account} history={account.history} key={account.accountName}></History>
					</div>
				);
			})}
		</div>
	);
}

function History({account}) {
	const [showHistory, setShowHistory] = useState();
	const history = account.history
	return (
		<div className="">
		<div className="row">
		<h4 className="col">{account.accountName}</h4>
		<h5 className="col text-end mx-5 text-secondary">${account.amount}</h5>
			<button
				className="btn btn-primary col"
				onClick={() => setShowHistory(!showHistory)}
			>
				{!showHistory? (<>Show</>): (<>Hide</>)} Account History
			</button>
		</div>
			<div className="my-2">
			{showHistory ? (
				<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Type</th>
						<th scope="col">Amount</th>
						<th scope="col">Date</th>
						<th scope="col">Recipient</th>
					</tr>
				</thead>
				<tbody>
					{history.sort((a, b) => a.date < b.date).map((history, idx) => (
						<HistoryItem history={history} idx={idx}></HistoryItem>
					))}
				</tbody>
			</table>
			): <></>
			}
			</div>
		</div>
	);
}

function HistoryItem({ history, idx }) {
	// console.log(history)
	const date = new Date(history.date);
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
