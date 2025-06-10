import React, {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {SxProps, AppBar, Toolbar, Typography} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FaceIcon from '@mui/icons-material/Face';
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
		<AppBar component="header" position="sticky">
			<Toolbar sx={{alignItems:"center", justifyContent: "space-between", background:"#fff", p:0}}>
				<Button sx={{p:0, display:"flex", flexDirection:"column", gap:0.5}} onClick={() => {navigate(-1);}}>
					<ArrowBackIosNewIcon sx={{fontSize:"1.2em"}}/>
					<Typography variant="button" sx={{lineHeight:1, fontSize:"0.9em"}}>BACK</Typography>
				</Button>
				<Button sx={{p:0}} onClick={() => navigate('/', {replace: true})}><img src={LogoImg} alt="" style={{maxWidth:85}}/></Button>
				<Button
					aria-controls="menu"
					aria-haspopup="true"
					onClick={(event:React.MouseEvent<HTMLElement>)=>{setAnchorElem(event.currentTarget);}}
					sx={{p:0, display:"flex", flexDirection:"column", gap:0.5}}
				>
					<FaceIcon sx={{fontSize:"1.2em"}}/>
					<Typography variant="button" sx={{lineHeight:1, fontSize:"0.9em"}}>MY</Typography>
				</Button>
				<Menu
					id="menu"
					anchorEl={anchorElem}
					keepMounted
					open={Boolean(anchorElem)}
					onClose={()=>{setAnchorElem(null);}}
					sx={{
						"& .css-1tktgsa-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {left:"auto !important", right:0, top:"auto !important", bottom:56, boxShadow:0, borderRadius:0}
					}}
				>
					<MenuItem onClick={logout} sx={StyledMenuItem}>
						<ExitToAppIcon fontSize="small" /> 로그아웃
					</MenuItem>
					<MenuItem component={RouterLink} to={"/folder"} sx={StyledMenuItem}>
						<FolderCopyOutlinedIcon fontSize="small" /> 폴더설정
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	)
}

export default Header;