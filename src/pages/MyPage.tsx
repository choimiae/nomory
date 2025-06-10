import React from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography, Link} from "@mui/material";
import PersonPinIcon from '@mui/icons-material/PersonPin';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import Layout from '../template/Layout';
import {useUser} from '../contexts/UserContext';

const MyPage = () => {
	const { user, setUser } = useUser();
	const navigate = useNavigate();

	// 로그아웃
	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		navigate('/', {replace: true});
	}

	return (
		<Layout>
			<Stack sx={{p:2, pb:1}}>
				<Typography component="h2" sx={{color:"#666", fontSize:"15px"}}>내 정보</Typography>
			</Stack>
			<Box sx={{p:2, pt:1}}>
				<List sx={{bgcolor:"#f5f5f5", borderRadius:2}}>
					<ListItem>
						<ListItemAvatar>
							<PersonPinIcon fontSize="large" sx={{display:"flex", alignItems:"center", margin:"0 auto", color:"#c0c0c0"}}/>
						</ListItemAvatar>
						<ListItemText primary={user?.nickname + " 님"} />
						<IconButton aria-label="로그아웃" onClick={logout}>
							<LogoutIcon />
						</IconButton>
					</ListItem>
				</List>
				<Stack direction="row" justifyContent="space-between" gap="10px 0" sx={{pt:3, pb:3}}>
					<Link component={RouterLink} to="/folder" underline="none" variant="button" sx={{display:"flex", flexDirection:"column", alignItems:"center", flex:"0 0 25%", color:"#686868"}}>
						<FolderCopyOutlinedIcon sx={{fontSize:"1.8em"}}/>폴더설정
					</Link>
				</Stack>
			</Box>

		</Layout>
	)
}

export default MyPage;