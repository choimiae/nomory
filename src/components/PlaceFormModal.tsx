import React, {useEffect, useState} from 'react';
import {Dialog , DialogTitle, DialogContent, TextField, DialogActions, Button, Rating, Typography} from '@mui/material';
import {MarkerListType} from "../setup/interfaces";

interface PlaceOptionType {
	open: boolean,
	onClose: () => void,
	onConfirm: (value:MarkerListType) => void,
	onDelete: (value:MarkerListType['idx']) => void,
	info: MarkerListType | null
}

const PlaceFormModal:React.FC<PlaceOptionType> = ({info, open, onClose, onConfirm, onDelete}) => {
	const [data, setData] = useState<MarkerListType | null>(info);

	useEffect(() => {
		setData(info);
	}, [info]);

	if(!open || !data) return null;

	// 일자 input
	const dateChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value.replace(/[^0-9]/g, '');

		value = value.replace(/^(\d{4})(\d{0,2})(\d{0,2})$/, (match, year, month, day) => {
			if (day) return `${year}-${month}-${day}`;
			if (month) return `${year}-${month}`;
			return year;
		});

		dataStore('date', value);
	}

	// 메모 input
	const memoChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		dataStore('memo', event.target.value);
	}

	// 별점 input
	const ratingChange = (event:React.SyntheticEvent, value:MarkerListType['rating']) => {
		dataStore('rating', value);
	}


	// 데이터 저장
	const dataStore = <K extends keyof MarkerListType>(key: K, value:MarkerListType[K]) => {
		return setData((prev) => prev ? { ...prev, [key]: value } : null);
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
					{data.title}
				</DialogTitle>
				<DialogContent dividers>
					<TextField
						autoFocus
						required
						margin="dense"
						label="주소"
						type="text"
						value={data.addr}
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
						onChange={dateChange}
						slotProps={{htmlInput:{maxLength:10}}}
					/>
					<TextField
						autoFocus
						margin="dense"
						label="메모"
						type="text"
						value={data.memo || ''}
						fullWidth
						variant="standard"
						onChange={memoChange}
						multiline
						rows={5}
					/>
					<Typography component="div" sx={{pt:2}}>평점</Typography>
					<Rating name="rating" value={data.rating || 0} max={5} onChange={ratingChange}/>
					{
						data.reg_date ?
							<Typography component="div" sx={{pt:2, color:'#7b7b7b'}}>등록일자: {data.reg_date.substring(0,10)}</Typography> : ''
					}
					{
						data.mod_date ?
							<Typography component="div" sx={{color:'#7b7b7b'}}>수정일자: {data.mod_date.substring(0,10)}</Typography> : data.mod_date
					}
				</DialogContent>
				<DialogActions>
					{
						data.reg_date ?
							<Button color="error" variant="contained" sx={{mr:'auto'}} onClick={() => {onDelete(data.idx);}}>삭제</Button> : ''
					}

					<Button variant='outlined' onClick={onClose}>닫기</Button>
					<Button type="button" variant="contained" onClick={() => {onConfirm(data);}}>저장</Button>
				</DialogActions>
			</Dialog >
		</>
	)
}

export default PlaceFormModal;