import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

import "./css/bootstrap.css";

export default function CustomerAccount() {
	const navigate = useNavigate();
	const [userRole, setUserRole] = useState("");

	const [customer, setCustomer] = useState({
		customerid: "",
		firstname: "",
		lastname: "",
		username: "",
		role: "",
		accounts: [],
	});
	const [customerRole, setCustomerRole] = useState("")

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

	const handleAccountUpdate = (newBankDetails) => {
		console.log("update", newBankDetails)
		setBank(newBankDetails);
	};
	const handleRoleUpdate = (newRole) => {
		console.log("update", newRole)
		setCustomerRole(newRole);
	};

	useEffect(() => {
		async function getUserDetails() {
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
				return;
			} 
			console.log(account)
			setUserRole(account.role);
		}
		async function getAccountDetails() {
			const response = await fetch(
				"http://localhost:5001/getCustomerSummary",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status == 301) {
				navigate("/");
				return;
			}

			const account = await response.json();
			setCustomer(account);
			setCustomerRole(account.role)
			setBank(account.accounts);
			// console.log(account);
		}

		getUserDetails().then(getAccountDetails);
	}, [navigate]);

	return (
		<div className="container-md mt-3">
			<div className="row">
				<h3 className="col">
					Customer:{" "}
					<span className="text-secondary">
						{customer.firstname} {customer.lastname}
					</span>
				</h3>
				<h4 className="col">
					Username:{" "}
					<span className="text-secondary">{customer.username}</span>
				</h4>
				<h4 className="col">
					Role:{" "}
					<span className="text-secondary">{customerRole}</span>
				</h4>
			</div>
			<ChangeRole role={userRole} customerRole={customerRole} onUpdate={handleRoleUpdate}/>

			<h2 className="mt-4">Bank Details</h2>
			{bankAccounts.map((account, idx) => {
				return (
					<div className="container-fluid my-3" key={account.accountName}>
						<History
							bankAccount={account}
						></History>
					</div>
				);
			})}
			<InsideTransferMenu
				bankAccounts={bankAccounts} onUpdate={handleAccountUpdate}
			></InsideTransferMenu>
			<TransferMenu bankAccounts={bankAccounts} onUpdate={handleAccountUpdate}></TransferMenu>
		</div>
	);
}

function History({ bankAccount }) {
	const [showHistory, setShowHistory] = useState();
	const [account, setAccount] = useState(bankAccount)
	useEffect(() => {
		setAccount(bankAccount)
	},[bankAccount])

	const handleAccountUpdate = (updatedAccount) => {
		console.log(account)
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
			<BankEdit account={account} onUpdate={handleAccountUpdate}></BankEdit>

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

function BankEdit({ account, onUpdate }) {
	const [amount, setAmount] = useState("");
	const [typeSelect, setType] = useState("Deposit");

	const updateAccount = useCallback( async (e) => {
		e.preventDefault();
		
		if (typeSelect === "Deposit") {
			const result = await fetch(`http://localhost:5001/employee/deposit`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						accountName: account.accountName, 
						depositAmount: amount
					}),
				}
			);
			onUpdate(await result.json())
		} else {
			const result = await fetch(`http://localhost:5001/employee/withdraw`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						accountName: account.accountName, 
						depositAmount: amount
					}),
				}
			);
			if(result.status === 301){
				window.alert("Can't Withdraw into Negatives")
				return
			}
			onUpdate(await result.json())
		}
		setAmount("")
		
	}, [account.accountName, amount, onUpdate, typeSelect])

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
							console.log(amount);
						}}
					/>
				</div>
				<div className="col">
					<br></br>
					<button
						type="submit"
						className="btn btn-secondary my-2"
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

function InsideTransferMenu({ bankAccounts, onUpdate }) {
	const [amount, setAmount] = useState();
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const updateAccount = useCallback( async (e) => {
		e.preventDefault();
		const response = await fetch("http://localhost:5001/emp-transfer", {
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
			<h2>Transfer Within Account</h2>
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
						<option selected = {from === "" ? "selected" : ""}></option>

						{bankAccounts.map((account, idx) => {
							if (account.accountName !== to) {
								return <option>{account.accountName}</option>;
							}
							return <></>;
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
							return <></>;
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

function TransferMenu({ bankAccounts, onUpdate }) {
	const [toCustomerID, setToCustomerID] = useState("");
	const [amount, setAmount] = useState();
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	const updateAccount = useCallback( async (e) => {
		e.preventDefault();
		const response = await fetch("http://localhost:5001/emp-outside-transfer", {
			method: "POST",
			credentials: "include",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  from: from,
			  amount: amount,
			  to: to,
			  toUser: toCustomerID
			}),
		  });
		  if(response.status === 302){
			window.alert(`Can't Transfer to user id ${toCustomerID}`)

		  }
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
		setToCustomerID("")
	}, [amount, from, to, toCustomerID, onUpdate])


	return (
		<>
			<h2>Transfer To Another Customer</h2>
			<form className="row mb-3 mx-3">
				<div className="col">
					<form className="row mb-3">
						<div className="col">
							<label
								for="customerIDSearch"
								className="form-label"
							>
								Customer ID:
							</label>
							<input
								type="text"
								id="customerIDSearch"
								className="form-control"
								placeholder="ID"
								value={toCustomerID}
								onChange={(e) => {
									setToCustomerID(e.target.value);
								}}
							></input>
						</div>
					</form>
				</div>
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
						<option selected = {from === "" ? "selected" : ""}></option>

						{bankAccounts.map((account, idx) => {
							return <option>{account.accountName}</option>;
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
							return <option>{account.accountName}</option>;
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

function ChangeRole({ role, customerRole, onUpdate }) {
	const [changedRole, setChangedRole] = useState(role);

	const onSubmit = useCallback( async (e)=> {
		e.preventDefault();

		if (role === "administrator") {
			const result = await fetch(
				`http://localhost:5001/changeCustomerRole`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						role: changedRole,
					}),
				}
			);
			onUpdate(await result.json())
		}
	}, [changedRole, role, onUpdate])

	if (role !== "administrator") return null;

	return (
		<>
			<div className="row">
				<h2 className="mt-4">Change Role</h2>
			</div>
			<form className="row mb-3 mx-3">
				<div className="col">
					<label for="roleSelect" className="form-label">
						Role:
					</label>
					<select
						id="roleSelect"
						className="form-select"
						onChange={(e) => {
							setChangedRole(e.target.value);
						}}
						value={!changedRole ? customerRole: changedRole}
					>
						<option></option>
						<option value="customer" selected={role === "customer"? "selected": ""}>customer</option>
						<option value="employee" selected={role === "employee"? "selected": ""}>employee</option>
						<option value="administrator" selected={role === "administrator"? "selected": ""}>administrator</option>
					</select>
				</div>
				<div className="col">
					<br></br>
					<button
						type="submit"
						className="btn btn-secondary my-2"
						onClick={onSubmit}
					>
						Change
					</button>
				</div>
			</form>
		</>
	);
}
