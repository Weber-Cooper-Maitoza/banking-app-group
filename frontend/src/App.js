import React from "react";
import { Route, Routes } from "react-router-dom";

import NavBar from "./components/navbar.js";
import Login from "./components/login.js";
import UserName from "./components/customerAccountSummary.js";
import CustomerSearch from "./components/customerSearch.js";
import CustomerAccount from "./components/searchedCustomerAccount.js";


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
				</Routes>
			</div>
		</>
	);
};

export default App;