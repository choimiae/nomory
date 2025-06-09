import React, {useEffect, useState} from 'react';
import {Box,Button,Stack,TextField,List,ListItem,ListItemAvatar,ListItemText,IconButton,Avatar,Dialog, DialogTitle, DialogContent, DialogActions, SxProps, Typography} from '@mui/material';
import Layout from '../template/Layout';
import {FolderItemType} from '../setup/interfaces';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import PlaylistAddSharpIcon from '@mui/icons-material/PlaylistAddSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../setup/api';
import {ToastAlert, ToastAlertType} from "../components/ToastAlert";

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
	color: '#000'
}

const FolderManage:React.FC = () => {
	const [list, setList] = useState<FolderItemType[] | null>(null);
	const [idx, setIdx] = useState<number | null>(null);
	const [data, setData] = useState<FolderItemType | FolderEachType | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [toast, setToast] = useState<ToastAlertType | null>(null);

	// 폴더 검색
	const selectList = async () => {
		const response = await api.get<{message: string, data:FolderItemType[] }>('/folder');
		setList(response.data.data);
	}

	useEffect(() => {
		selectList();
	}, []);

	// 폴더 클릭
	const selectFolderOpen = (idx?:FolderItemType['idx']) => {
		idx ? setIdx(idx) : setIdx(null);

		const matchFolder = list?.find(item => item.idx === idx);
		matchFolder ? setData(matchFolder) : setData(null);

		setOpen(true);
	}

	// 폴더 닫기
	const selectFolderClose = () => {
		setOpen(false);
	}

	// 폴더 저장
	const saveFolder = async () => {
		if(data?.title?.trim()) {
			const response = idx ? await api.patch<FolderItemType>('/folder', {...data, idx}) : await api.post<FolderEachType>('/folder', data as FolderEachType);

			await selectList();

			setOpen(false);
			setToast(() => ({
				open: true,
				type: 'success',
				message: '폴더가 저장되었습니다.',
				onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null)),
			}));
		}
	}

	return (
		<>
			<Layout>
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{p:2, pb:1}}>
					<Typography component="h2" sx={{color:"#666", fontSize:"15px"}}>폴더설정</Typography>
					<IconButton color="primary" aria-label="폴더 추가하기" sx={{p:0}} onClick={() => {selectFolderOpen()}}><PlaylistAddSharpIcon /></IconButton>
				</Stack>
				<Box>
					<List dense={true}>
						{
							list && list.map((item:FolderItemType) => {
								return (
									<ListItem key={item.idx}
									          secondaryAction={
												<Stack direction="row" gap={1}>
													<IconButton edge="end" aria-label="삭제">
														<DeleteIcon fontSize="small"/>
													</IconButton>
													<IconButton edge="end" aria-label="설정" onClick={() => selectFolderOpen(item.idx)}>
														<SettingsIcon fontSize="small"/>
													</IconButton>
												</Stack>
											}
									>
										<ListItemAvatar>
											<Avatar sx={{bgcolor: item.color}}><FolderIcon/></Avatar>
										</ListItemAvatar>
										<ListItemText primary={item.title}/>
									</ListItem>
								)
							})
						}
					</List>
				</Box>
			</Layout>

			<Dialog
				onClose={selectFolderClose}
				open={open}
				fullWidth={true}
				maxWidth="sm"
				sx={StyledDialog}
			>
				<DialogTitle sx={{ m:0, pt:1.5, pb:1.5, pl:2, pr:2 }}>폴더 정보</DialogTitle>
				<DialogContent dividers>
					<Stack spacing={1} mt={1}>
						<Stack direction="row" alignItems="flex-end" spacing={1}>
							<TextField
								type="color"
								value={data?.color ?? INIT_FOLDER_VALUE.color}
								sx={{
									flex:"0 0 40px",
									"& input" : {padding:0, height:32}
								}}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setData(prev => ({...(prev ?? INIT_FOLDER_VALUE), color: event.target.value}));}}
							/>
							<TextField
								autoFocus
								required
								margin="dense"
								type="text"
								fullWidth
								variant="standard"
								placeholder="폴더 이름을 입력해 주세요."
								value={data?.title ?? INIT_FOLDER_VALUE.title}
								onChange={(event:React.ChangeEvent<HTMLInputElement>) => {setData(prev => ({...(prev ?? INIT_FOLDER_VALUE), 'title' : event.target.value}))}}
							/>
						</Stack>
					</Stack>
				</DialogContent>
				<DialogActions sx={{justifyContent:"center"}}>
					<Button variant="outlined" sx={{flex:"1 1 auto"}} onClick={selectFolderClose}>취소</Button>
					<Button type="button" variant="contained" sx={{flex:"0 0 60%"}} onClick={saveFolder}>저장하기</Button>
				</DialogActions>
			</Dialog>

			{/* 알림 :: 토스트 */}
			<ToastAlert toast={toast} />
		</>
	)
}

export default FolderManage;