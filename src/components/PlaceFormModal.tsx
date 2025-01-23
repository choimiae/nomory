import React, {useState} from 'react';
import {Dialog , DialogTitle, DialogContent, TextField, DialogActions, Button} from '@mui/material';


interface PlaceOptionType {
	open: boolean,
	onClose: () => void,
	info: {
		position: {
			lat: number,
			lng: number
		},
		content: string,
		addrName: string,
		date?: Date | null,
		memo?: string | null,
	} | null
}

const PlaceFormModal:React.FC<PlaceOptionType> = ({info, open, onClose}) => {

	if(!open || !info) return null;

	return (
		<>
			<Dialog
				onClose={onClose}
				open={open}
				fullWidth={true}
				maxWidth="sm"
			>
				<DialogTitle sx={{ m: 0, p: 2 }}>
					{info.content}
				</DialogTitle>
				<DialogContent dividers>
					<TextField
						autoFocus
						required
						margin="dense"
						label="주소"
						type="text"
						value={info.addrName}
						fullWidth
						multiline
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						label="방문 일자"
						type="text"
						placeholder="YYYY-MM-DD"
						value={info.date}
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						label="메모"
						type="text"
						value={info.memo}
						fullWidth
						variant="standard"
						multiline
						rows={5}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>닫기</Button>
					<Button type="button" variant="contained">저장</Button>
				</DialogActions>
			</Dialog >
		</>
	)
}

export default PlaceFormModal;