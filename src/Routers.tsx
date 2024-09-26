import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Maps from "./components/map/Maps";

function Routers() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/map" element={<Maps/>}></Route>
			</Routes>
		</BrowserRouter>
	)
}

export default Routers;