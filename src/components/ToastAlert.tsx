import React from 'react';
import {Snackbar, Alert, Backdrop} from '@mui/material';

type ToastAlertTypeList = 'success' | 'error' | 'warning' | 'info';

export interface ToastAlertType {
	open: boolean,
	type: ToastAlertTypeList,
	message: string,
	onClose: () => void
}

interface ToastContainerType {
	toast: ToastAlertType | null;
}

export const ToastAlert:React.FC<ToastContainerType> = ({toast}) => {

	if(!toast?.open)
		return null;

	return (
		<>
			<Backdrop
				open={toast.open}
				sx={{ zIndex: 1200, background:"rgba(0,0,0,0.3)"}}
			/>
			<Snackbar
				open={toast.open}
				autoHideDuration={1500}
				onClose={toast.onClose}
			>
				<Alert
					onClose={toast.onClose}
					severity={toast.type}
					sx={{width: "100%", zIndex: 1500}}
				>
					{toast.message}
				</Alert>
			</Snackbar>
		</>

	)
}