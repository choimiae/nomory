import React, {useEffect, useState} from 'react';
import {Dialog , DialogTitle, DialogContent, TextField, DialogActions, Button} from '@mui/material';
import {MarkerListType} from "../setup/interfaces";

interface PlaceOptionType {
	open: boolean,
	onClose: () => void,
	info: MarkerListType | null
}

const PlaceFormModal:React.FC<PlaceOptionType> = ({info, open, onClose}) => {
	//const [dateFormat, setDateFormat] = useState<string | null>(null);

	const [data, setData] = useState<MarkerListType | null>(info);

	useEffect(() => {
		setData(info);
	}, [info]);

	if(!open || !data) return null;

	// 데이터 저장
	const inputChange = (field: keyof MarkerListType) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			let values = event.target.value;

			// 날짜 - 포맷 적용
			if(field === 'date')
				values = values.replace(/[^0-9]/g, '').replace(/^(\d{4})(\d{2})(\d{0,2})$/, '$1-$2-$3');

			setData((prev) => prev ? { ...prev, [field]: values } : null);
		};

	return (
		<>
			<Dialog
				onClose={onClose}
				open={open}
				fullWidth={true}
				maxWidth="sm"
			>
				<DialogTitle sx={{ m: 0, p: 2 }}>
					{data.content}
				</DialogTitle>
				<DialogContent dividers>
					<TextField
						autoFocus
						required
						margin="dense"
						label="주소"
						type="text"
						value={data.addrName}
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
						value={data.date || ''}
						fullWidth
						variant="standard"
						onChange={inputChange('date')}
						slotProps={{htmlInput:{maxLength:10}}}
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						label="메모"
						type="text"
						value={data.memo || ''}
						fullWidth
						variant="standard"
						onChange={inputChange('memo')}
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