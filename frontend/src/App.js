import React from "react";
import { Route, Routes } from "react-router-dom";

import NavBar from "./components/navbar.js";
import Login from "./components/login.js";
import UserName from "./components/customerAccountSummary.js";
import CustomerSearch from "./components/customerSearch.js";
import CustomerAccount from "./components/searchedCustomerAccount.js";
import CreateAccount from "./components/create-account.js"
import CreateAdmin from "./components/admin-create.js"


const App = () => {
	return (
		<>
			<NavBar />
			<div id="content">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/c-account" element={<UserName />} />
					<Route path="/e-customer-search" element={<CustomerSearch />} />
					<Route path="/e-customer-account" element={<CustomerAccount />} />
					<Route path="/createAccount" element={<CreateAccount />} />
					<Route path="/createAdmin" element={<CreateAdmin />} />
				</Routes>
			</div>
		</>
	);
};

export default App;