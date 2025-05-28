import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Rating, Typography, SxProps, Box, Stack, Chip, Collapse} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {FolderItemType, MarkerListType} from '../setup/interfaces';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddIcon from '@mui/icons-material/Add';
import api from '../setup/api';

interface PlaceOptionType {
	open: boolean;
	onClose: () => void;
	onConfirm: (value:MarkerListType) => void;
	onDelete: (value:MarkerListType['idx']) => void;
	info: MarkerListType | null;
}

type FolderEachType = Omit<FolderItemType, 'idx'>

const StyledDialog: SxProps = {
	'& .MuiDialog-container': {
		alignItems: 'flex-end'
	},
	'& .MuiDialog-paper': {
		margin: 0,
		borderRadius: 0,
		width: '100%',
		maxWidth: '100%',
		maxHeight:'100%'
	}
};

const INIT_FOLDER_VALUE:FolderEachType = {
	title: '',
	color: '#3d6cb3'
}

const StyledChip = styled(Chip) <{$active: boolean, $color: string}>`
	border-color: ${({ $active, $color }) => ($active ? $color : '#c6c6c6')};
	background: ${({ $active, $color }) => ($active ? `${$color} !important` : '#fff')};
	color: ${({ $active }) => ($active ? '#fff' : '#111')};
	.MuiChip-icon {
		color: ${({ $active, $color }) => ($active ? '#fff' : $color)};
	}
`;

const PlaceFormModal:React.FC<PlaceOptionType> = ({info, open, onClose, onConfirm, onDelete}) => {
	const [data, setData] = useState<MarkerListType | null>(null);
	const [folderOpen, setFolderOpen] = useState<boolean>(false);
	const [folderList, setFolderList] = useState<FolderItemType[] | null>(null);
	const [folderIdx, setFolderIdx] = useState<number | null>(null);
	const [folderEach, setFolderEach] = useState<FolderEachType>(INIT_FOLDER_VALUE);

	// 폴더 검색
	const selectFolderList = async () => {
		const response = await api.get<{message: string, data:FolderItemType[] }>('/folder');
		return response.data.data;
	}

	useEffect(() => {
		if(info && open) {
			setData(info);
			setFolderIdx(info.folder_idx ?? null);
			setFolderOpen(false);
			setFolderEach(INIT_FOLDER_VALUE);
			selectFolderList().then(setFolderList);
		}
	}, [info, open]);

	if(!open || !data) return null;

	// 폴더 저장
	const saveFolder = async () => {
		if(folderEach.title.trim() !== '') {
			const response = await api.post<FolderEachType>('/folder', folderEach);
			selectFolderList().then(setFolderList);
		}
	}

	// 일자 input
	const dateChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value.replace(/[^0-9]/g, '');

		value = value.replace(/^(\d{4})(\d{0,2})(\d{0,2})$/, (match, year, month, day) => {
			if (day) return `${year}-${month}-${day}`;
			if (month) return `${year}-${month}`;
			return year;
		});

		handleChange('date', value);
	}

	// 데이터 저장
	const handleChange = <K extends keyof MarkerListType>(key: K, value:MarkerListType[K]) => {
		return setData((prev) => prev ? { ...prev, [key]: value } : null);
	}

	return (
		<>
			<Dialog
				onClose={onClose}
				open={open}
				fullWidth={true}
				maxWidth="sm"
				sx={StyledDialog}
			>
				<DialogTitle sx={{ m:0, pt:1.5, pb:1.5, pl:2, pr:2 }}>
					<Stack component="div" direction="row" alignItems="center" justifyContent="space-between" gap="0 10px">
						{data.title}
						<IconButton component="a" href={`https://place.map.kakao.com/${data.idx}`} target="_blank" rel="noopener noreferrer" color="primary" size="small" aria-label="공유하기">
							<OpenInNewIcon fontSize="small" />
						</IconButton>
					</Stack>
				</DialogTitle>
				<DialogContent dividers>
					<Stack direction="row" gap="5px" flexWrap="wrap" sx={{mb:1}}>
						<StyledChip
							icon={<FiberManualRecordIcon sx={{ fontSize: "12px !important" }} />}
							label="기본"
							variant="outlined"
							size="small"
							$active={folderIdx == null}
							$color={INIT_FOLDER_VALUE.color}
							sx={{ pl: 0.5 }}
							onClick={() => {setFolderIdx(null);}}
						/>
						{
							folderList && folderList.map((item:FolderItemType) => {
								return (
									<StyledChip
										key={item.idx}
										icon={<FiberManualRecordIcon sx={{fontSize: "12px !important"}} />}
										label={item.title}
										variant="outlined"
										size="small"
										$active={item.idx === folderIdx}
										$color={item.color}
										sx={{pl:0.5}}
										onClick={() => {setFolderIdx(item.idx);}}
									/>
								)
							})
						}
						<Chip
							icon={<AddIcon sx={{color: "#fff !important"}}/>}
							color="secondary"
							label="폴더 추가"
							variant="filled"
							size="small"
							sx={{pl:0.5}}
							onClick={() => {setFolderOpen(true);}}
						/>
						<Collapse in={folderOpen} timeout="auto" unmountOnExit sx={{width:"100%"}}>
							<Stack spacing={1} mt={1}>
								<Stack direction="row" alignItems="flex-end" spacing={1}>
									<TextField
										type="color"
										value={folderEach.color}
										sx={{
											flex:"0 0 40px",
											"& input" : {padding:0, height:32}
										}}
										onChange={(event) => {setFolderEach(prev => ({...prev, 'color' : event.target.value}));}}
									/>
									<TextField
										autoFocus
										required
										margin="dense"
										type="text"
										fullWidth
										variant="standard"
										placeholder="폴더 이름을 입력해 주세요."
										value={folderEach.title}
										onChange={(event) => {setFolderEach(prev => ({...prev, 'title' : event.target.value}));}}
									/>
								</Stack>
								<Button type="button" variant="outlined" onClick={saveFolder}>폴더 추가하기</Button>
							</Stack>
						</Collapse>
					</Stack>
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
						onChange={(event:React.ChangeEvent<HTMLInputElement>) => {handleChange('memo', event.target.value);}}
						multiline
						rows={5}
					/>
					<Typography component="div" sx={{pt:2}}>평점</Typography>
					<Rating name="rating" value={data.rating || 0} max={5} onChange={(event, value) => {handleChange('rating', value)}}/>
					<Box component="div" sx={{mt:2, display:"flex", alignItems:"center", gap:"0 20px", color:'#7b7b7b'}}>
						{ data.reg_date ? <Typography component="div">등록일자: {data.reg_date.substring(0,10)}</Typography> : '' }
						{ data.mod_date ? <Typography component="div">수정일자: {data.mod_date.substring(0,10)}</Typography> : data.mod_date }
					</Box>
					{ data.reg_date ? <Button color="error" variant="outlined" sx={{mt:2, width:"100%"}} onClick={() => {onDelete(data.idx);}}>장소 삭제하기</Button> : '' }
				</DialogContent>
				<DialogActions sx={{justifyContent:"center"}}>
					<Button variant='outlined' sx={{flex:"1 1 auto"}} onClick={onClose}>취소</Button>
					<Button type="button" variant="contained" sx={{flex:"0 0 60%"}} onClick={() => {onConfirm({...data, folder_idx: folderIdx});}}>저장하기</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default PlaceFormModal;