import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import theme from "./setup/theme";
import List from "./pages/List";
import Register from "./pages/Register";
import Login from "./pages/Login";

const Routers:React.FC = () => {

	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Navigate to="/login"/>}></Route>
					<Route path="/login" element={<Login/>}></Route>
					<Route path="/register" element={<Register/>}></Route>
					<Route path="/place/list" element={<List/>}></Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default Routers;