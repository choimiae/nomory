import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import CustomThemeProvider from '../contexts/ThemeContext';
import {UserProvider} from '../contexts/UserContext';
import PrivateRoute from '../routes/PrivateRoute';
import List from '../pages/List';
import Register from '../pages/Register';
import Login from '../pages/Login';

const AppRouter:React.FC = () => {

	return (
		<UserProvider>
			<CustomThemeProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<PrivateRoute><List/></PrivateRoute>}></Route>
						<Route path="/login" element={<Login/>}></Route>
						<Route path="/register" element={<Register/>}></Route>
						<Route path="/place/list" element={<PrivateRoute><List/></PrivateRoute>}></Route>
					</Routes>
				</BrowserRouter>
			</CustomThemeProvider>
		</UserProvider>
	)
}

export default AppRouter;