import React from 'react';
import {Snackbar, Alert, Backdrop} from '@mui/material';

type ToastAlertTypeList = 'success' | 'error' | 'warning' | 'info';

export interface ToastAlertType {
	open: boolean,
	type: ToastAlertTypeList,
	message: string,
	onClose: () => void
}

export const ToastAlert:React.FC<ToastAlertType> = ({open, type, message, onClose}) => {

	return (
		<>
			<Backdrop
				open={open}
				sx={{ zIndex: 1200, background:"rgba(0,0,0,0.3)"}}
			/>
			<Snackbar
				open={open}
				autoHideDuration={1500}
				onClose={onClose}
			>
				<Alert
					onClose={onClose}
					severity={type}
					sx={{width: "100%", zIndex: 1500}}
				>
					{message}
				</Alert>
			</Snackbar>
		</>

	)
}