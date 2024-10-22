import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import theme from "./setup/theme";
import List from "./pages/List";

const Routers:React.FC = () => {

	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/list" element={<List/>}></Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default Routers;