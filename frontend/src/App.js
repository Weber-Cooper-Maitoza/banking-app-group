import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./components/login.js";

const App = () => {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Login />} />
			</Routes>
		</div>
	);
};

export default App;