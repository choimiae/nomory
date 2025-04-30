import React from 'react';
import {Navigate} from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import {useUser} from '../contexts/UserContext';

const PrivateRoute = ({children} : {children: JSX.Element}) => {
	const { user, loading } = useUser();

	if(loading)
		return <CircularProgress />;

	if(!user)
		return <Navigate to="/login" replace />

	return children;
}

export default PrivateRoute;