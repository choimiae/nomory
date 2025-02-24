import React from 'react';
import {Snackbar, Alert} from '@mui/material';

export enum ToastAlertTypeList {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
}

export interface ToastAlertType {
	open: boolean,
	type: ToastAlertTypeList,
	message: string,
	onClose: () => void
}

export const ToastAlert:React.FC<ToastAlertType> = ({open, type, message, onClose}) => {

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