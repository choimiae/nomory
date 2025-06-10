import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import CustomThemeProvider from '../contexts/ThemeContext';
import {UserProvider} from '../contexts/UserContext';
import PrivateRoute from '../routes/PrivateRoute';
import PlaceList from '../pages/PlaceList';
import Register from '../pages/Register';
import Login from '../pages/Login';
import FolderManage from '../pages/FolderManage';
import MyPage from '../pages/MyPage';

const AppRouter:React.FC = () => {

	return (
		<UserProvider>
			<CustomThemeProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<PrivateRoute><PlaceList/></PrivateRoute>}></Route>
						<Route path="/login" element={<Login/>}></Route>
						<Route path="/register" element={<Register/>}></Route>
						<Route path="/place" element={<PrivateRoute><PlaceList/></PrivateRoute>}></Route>
						<Route path="/folder" element={<PrivateRoute><FolderManage/></PrivateRoute>}></Route>
						<Route path="/my-page" element={<PrivateRoute><MyPage/></PrivateRoute>}></Route>
					</Routes>
				</BrowserRouter>
			</CustomThemeProvider>
		</UserProvider>
	)
}

export default AppRouter;