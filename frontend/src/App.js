import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./components/login.js";
import  UserName from "./components/customerAccountSummary.js";
import CustomerSearch from "./components/customerSearch.js";


const App = () => {
	return (
		<div id="content">
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/c-account" element={<UserName />} />
				<Route path="/e-customer-search" element={<CustomerSearch />} />

			</Routes>
		</div>
	);
};

export default App;