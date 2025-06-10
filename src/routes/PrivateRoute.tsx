import React from 'react';
import {Navigate} from 'react-router-dom';
import {CircularProgress, Box} from '@mui/material';
import {useUser} from '../contexts/UserContext';

const PrivateRoute = ({children} : {children: JSX.Element}) => {
	const { user, loading } = useUser();

	if(loading)
		return <Box sx={{position:"fixed", left:0, top:0, width:"100%", height:"100%", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center"}}><CircularProgress /></Box>;

	if(!user)
		return <Navigate to="/login" replace />

	return children;
}

export default PrivateRoute;