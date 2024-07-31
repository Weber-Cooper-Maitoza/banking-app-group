import React from "react";
import { Route, Routes } from "react-router-dom";

import NavBar from "./components/navbar.js";
import Login from "./components/login.js";
import UserName from "./components/customerAccountSummary.js";
import CustomerSearch from "./components/customerSearch.js";


const App = () => {
	return (
		<>
			<NavBar />
			<div id="content">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/c-account" element={<UserName />} />
					<Route path="/e-customer-search" element={<CustomerSearch />} />

				</Routes>
			</div>
		</>
	);
};

export default App;