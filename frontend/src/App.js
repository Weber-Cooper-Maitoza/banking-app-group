import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./components/login.js";
import AdminCreate from "./components/admin-create.js"
import AccountCreate from "./components/create-account.js";

const App = () => {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/admin/create" element={<AdminCreate />} />
				<Route path="/account/create" element={<AccountCreate />} />
			</Routes>
		</div>
	);
};

export default App;