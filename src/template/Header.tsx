import React, {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Box, Link, Stack, SxProps, IconButton, Avatar} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import LogoImg from '../assets/logo.png';
import {useUser} from '../contexts/UserContext';

const Header:React.FC = () => {
	const { user, setUser } = useUser();
	const [anchorElem, setAnchorElem] = useState<HTMLElement | null>(null);
	const navigate = useNavigate();

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);

		navigate('/', {replace: true});
	}

	const StyledMenuItem: SxProps = {
		gap:"0 8px",
		color:"#7c7c7c",
		minHeight:"auto"
	};

	return (
		<Stack
			component="header"
			direction="row"
			alignItems="center"
			justifyContent="center"
			sx={{
				p:2,
				pb:1.5,
				borderBottom:"1px solid #eee",
				position:"sticky",
				left:0,
				top:0,
				zIndex:10,
				background:"#fff"
			}}
		>
			<IconButton aria-label="뒤로가기" sx={{p:0, position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#686868"}} onClick={() => {navigate(-1);}}>
				<ArrowBackIosNewIcon fontSize="small"/>
			</IconButton>
			<Box component="h1">
				<Button sx={{p:0}} onClick={() => navigate('/', {replace: true})}><img src={LogoImg} alt="" style={{maxWidth:85}}/></Button>
			</Box>
			<Box sx={{position:"absolute", right:15, top:"50%", transform:"translateY(-50%)"}}>
				<Button
					onClick={(event:React.MouseEvent<HTMLElement>)=>{setAnchorElem(event.currentTarget);}}
					sx={{gap:"0 5px", p:0, lineHeight:1, minWidth:"auto"}}
				>
					<Avatar sx={{width:30, height:30, fontSize:"1.1em" }}>{user?.nickname ? user.nickname.charAt(0).toUpperCase() : 'U'}</Avatar>
				</Button>
				<Menu
					id="menu"
					anchorEl={anchorElem}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={Boolean(anchorElem)}
					onClose={()=>{setAnchorElem(null);}}
					sx={{top:10}}
				>
					<MenuItem onClick={logout} sx={StyledMenuItem}>
						<ExitToAppIcon fontSize="small" /> 로그아웃
					</MenuItem>
					<MenuItem component={RouterLink} to={"/folder"} sx={StyledMenuItem}>
						<FolderCopyOutlinedIcon fontSize="small" /> 폴더설정
					</MenuItem>
				</Menu>
			</Box>
		</Stack>
	)
}

export default Header;