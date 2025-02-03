import React, {useEffect, useState} from 'react';
import {Dialog , DialogTitle, DialogContent, TextField, DialogActions, Button, Rating, Typography} from '@mui/material';
import {MarkerListType} from "../setup/interfaces";

interface PlaceOptionType {
	open: boolean,
	onClose: () => void,
	onConfirm: (value:MarkerListType) => void,
	info: MarkerListType | null
}

const PlaceFormModal:React.FC<PlaceOptionType> = ({info, open, onClose, onConfirm}) => {
	const [data, setData] = useState<MarkerListType | null>(info);

	useEffect(() => {
		setData(info);
	}, [info]);

	if(!open || !data) return null;

	// 데이터 저장
	const inputChange = (field: keyof MarkerListType) => {
		return (event: React.ChangeEvent<HTMLInputElement>) => {
			let values = event.target.value;

			// 날짜 - 포맷 적용
			if(field === 'date')
				values = values.replace(/[^0-9]/g, '').replace(/^(\d{4})(\d{2})(\d{0,2})$/, '$1-$2-$3');

			setData((prev) => prev ? { ...prev, [field]: values } : null);
		};
	}

	// 별점 데이터 저장
	const ratingChange = (event:React.SyntheticEvent, value:number|null) => {
		setData((prev) => prev ? { ...prev, rating: value} : null);
	}

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
					<Typography component="div" sx={{pt:2}}>평점</Typography>
					<Rating name="rating" value={data.rating || 0} max={5} onChange={ratingChange}/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>닫기</Button>
					<Button type="button" variant="contained" onClick={() => {onConfirm(data);}}>저장</Button>
				</DialogActions>
			</Dialog >
		</>
	)
}

export default PlaceFormModal;