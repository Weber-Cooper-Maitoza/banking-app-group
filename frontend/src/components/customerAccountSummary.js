import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

import "./css/bootstrap.css";

export default function UserName() {
	const navigate = useNavigate();

	const [account, setAccount] = useState({
		firstname: "",
		lastname: "",
		role: "",
	});
	const [bankAccounts, setBank] = useState([

	]);

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
			} else {
				setAccount(account);
				setBank(account.accounts);
			}
		}
		getAccountDetails();
	}, [navigate]);

	const handleAccountUpdate = (newBankDetails) => {
		setBank(newBankDetails);
	};

	return (
		<div className="container-md mt-3">
			<div className="col">
				<h2>Welcome!</h2>
				<div className="row mx-1">
					<h4 className="col">
						Customer:{" "}
						<span className="text-secondary">
							{account.firstname} {account.lastname}
						</span>
					</h4>
					<h4 className="col">
						Username:{" "}
						<span className="text-secondary">
							{account.username}
						</span>
					</h4>
					<h4 className="col">
						Role:{" "}
						<span className="text-secondary">{account.role}</span>
					</h4>
				</div>
			</div>
			<h2 className="mt-4">Bank Details</h2>

			{bankAccounts.map((account, idx) => {
				return (
					<div className="container-fluid my-3" key={account.accountName}>
						<History accountDetails={account} />

					</div>
				);
			})}
			<TransferMenu bankAccounts={bankAccounts} onUpdate={handleAccountUpdate}></TransferMenu>
		</div>
	);
}

function History({ accountDetails }) {
	
	const [showHistory, setShowHistory] = useState();
	const [account, setAccount] = useState(accountDetails)
	useEffect(() => {
		setAccount(accountDetails);
	  }, [accountDetails]);

	const handleAccountUpdate = (updatedAccount) => {
		setAccount(updatedAccount);
	  };
	
	return (
		<div className="container">
			<div className="row">
				<h4 className="col-3">{account.accountName}</h4>
				<h5 className="col text-end mx-5 text-secondary">
					${account.amount}
				</h5>
				<div className="col-4">
					<button
						className="btn btn-primary"
						onClick={() => setShowHistory(!showHistory)}
					>
						{!showHistory ? <>Show</> : <>Hide</>} Account History
					</button>
				</div>
			</div>
			<BankEdit accountDetails={account} onUpdate={handleAccountUpdate}></BankEdit>

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
							{(account.history)
								.sort((a, b) => a.date < b.date)
								.map((history, idx) => (
									<HistoryItem
										history={history}
										idx={idx}
										key={idx}
									></HistoryItem>
								))}
						</tbody>
					</table>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}

function HistoryItem({ history, idx }) {
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

function BankEdit({ accountDetails, onUpdate }) {
	const [amount, setAmount] = useState("");
	const [typeSelect, setType] = useState("Deposit");
	const [account, setAccount] = useState(accountDetails)


	const updateAccount = useCallback(
		async (event) => {
		  event.preventDefault();
	
		  let response;
		  if (typeSelect === "Withdraw") {

			response = await fetch("http://localhost:5001/cu-withdraw", 
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				accountName: account.accountName,
				withdrawAmount: amount,
			  }),
			});

			if(response.status === 301){
				window.alert("Can't Withdraw into negative")
				return
			}
			const data = await response.json();
			setAccount(data.selectedAccount);
			onUpdate(data.selectedAccount); // Update the parent component
		  }
	
		  if (typeSelect === "Deposit") {
			response = await fetch("http://localhost:5001/cu-deposit", {
			  method: "POST",
			  credentials: "include",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				accountName: account.accountName,
				depositAmount: amount,
			  }),
			});
			const data = await response.json();
			setAccount(data.selectedAccount);
			onUpdate(data.selectedAccount); // Update the parent component
		  }
		  setAmount("")
		},
		[account, amount, typeSelect, onUpdate]
	  );


	return (
		<>
			<form className="row mb-3">
				<div className="col">
					<label for="disabledSelect" className="form-label">
						Type:
					</label>
					<select
						id="disabledSelect"
						className="form-select"
						onChange={(e) => {
							setType(e.target.value);
						}}
					>
						<option>Deposit</option>
						<option>Withdraw</option>
					</select>
				</div>
				<div className="col">
					<label for="amount" className="form-label">
						Amount:
					</label>
					<input
						type="text"
						id="amount"
						className="form-control"
						placeholder="0"
						value={amount}
						onChange={(e) => {
							const re = new RegExp(
								"^\\$?(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)?(\\.\\d{0,2})?$"
							);

							if (
								e.target.value === "" ||
								re.test(e.target.value)
							) {
								setAmount(e.target.value);
							}
						}}
					/>
				</div>
				<div className="col">
					<br></br>
					<button
						type="submit"
						className={`btn btn-secondary my-2`}
						onClick={updateAccount}
						disabled={amount === ""}
					>
						Submit
					</button>
				</div>
			</form>
		</>
	);
}

function TransferMenu({ bankAccounts, onUpdate}) {
	const [amount, setAmount] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const updateAccount = useCallback( async (e) => {
		e.preventDefault();
		const response = await fetch("http://localhost:5001/cu-transfer", {
			method: "POST",
			credentials: "include",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  from: from,
			  amount: amount,
			  to: to
			}),
		  });
		  if(response.status === 301){
			console.log("error")
			window.alert(`Can't Transfer ${from} can not be negative`)
			return;
		  }
		  const data = await response.json()
		onUpdate(data.returnValue)
		setAmount("")
		setFrom("")
		setTo("")
	}, [amount, from, to, onUpdate])


	return (
		<>
			<h2>Transfer</h2>
			<form className="row mb-3 mx-3">
				<div className="col">
					<label for="disabledSelect" className="form-label">
						From:
					</label>
					<select
						id="disabledSelect"
						className="form-select"
						onChange={(e) => {
							setFrom(e.target.value);
						}}
					>
						<option selected = {from === "" ? "selected" : ""} ></option>

						{bankAccounts.map((account, idx) => {
							if (account.accountName !== to) {
								return <option>{account.accountName}</option>;
							}
							return <></>
						})}
					</select>
				</div>
				<div className="col">
					<label for="disabledSelect" className="form-label">
						To:
					</label>
					<select
						id="disabledSelect"
						className="form-select"
						onChange={(e) => {
							setTo(e.target.value);
						}}
					>
						<option selected = {to === "" ? "selected" : ""}></option>
						{bankAccounts.map((account, idx) => {
							if (account.accountName !== from) {
								return <option>{account.accountName}</option>;
							}
							return <></>
						})}
					</select>
				</div>
				<div className="col">
					<label for="amount" className="form-label">
						Amount:
					</label>
					<input
						type="text"
						id="amount"
						className="form-control"
						placeholder="0"
						value={amount}
						onChange={(e) => {
							const re = /^[0-9\b]+$/;
							if (
								e.target.value === "" ||
								re.test(e.target.value)
							) {
								setAmount(e.target.value);
							}
						}}
					/>
				</div>
				<div className="col">
					<br></br>
					<button
						type="submit"
						className="btn btn-secondary my-2"
						onClick={updateAccount}
						disabled={from === "" || to === ""}
					>
						Submit
					</button>
				</div>
			</form>
		</>
	);
}
