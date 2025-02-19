import React from 'react';
import {Snackbar, Alert} from '@mui/material';
import {ToastAlertType} from '../setup/interfaces';

const ToastAlert:React.FC<ToastAlertType> = ({open, type, message, onClose}) => {

	return (
		<Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
			<Alert
				onClose={onClose}
				severity={type}
				variant="filled"
				sx={{width: "100%"}}
			>
				{message}
			</Alert>
		</Snackbar>
	)
}

export default ToastAlert;