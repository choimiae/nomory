import React, {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Box, Link, Stack, SxProps} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
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

		navigate('/');
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
			justifyContent="space-between"
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
			<Box component="h1">
				<Link component={RouterLink} to="/"><img src={LogoImg} alt="" style={{maxWidth:85}}/></Link>
			</Box>
			<div>
				<Button
					size="medium"
					aria-controls="menu"
					aria-haspopup="true"
					onClick={(event:React.MouseEvent<HTMLElement>)=>{setAnchorElem(event.currentTarget);}}
					sx={{gap:"0 5px", p:0, lineHeight:1}}
				>
					<FaceIcon />
					{user?.nickname}
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
						<FolderCopyOutlinedIcon fontSize="small" /> 폴더관리
					</MenuItem>
				</Menu>
			</div>
		</Stack>
	)
}

export default Header;