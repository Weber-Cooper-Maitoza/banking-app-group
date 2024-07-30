import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./components/login.js";
import  UserName from "./components/customerAccountSummary.js";


const App = () => {
	return (
		<div id="content">
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/c-account" element={<UserName />} />

			</Routes>
		</div>
	);
};

export default App;