import React from 'react';
import {useNavigate} from 'react-router-dom';
import {AppBar, Toolbar, Typography} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FaceIcon from '@mui/icons-material/Face';
import Button from '@mui/material/Button';
import LogoImg from '../assets/logo.png';

const Header:React.FC = () => {
	const navigate = useNavigate();
	return (
		<AppBar component="header" position="sticky">
			<Toolbar sx={{alignItems:"center", justifyContent: "space-between", background:"#fff", p:0}}>
				<Button sx={{p:0, display:"flex", flexDirection:"column", gap:0.5}} onClick={() => {navigate(-1);}}>
					<ArrowBackIosNewIcon sx={{fontSize:"1.2em"}}/>
					<Typography variant="button" sx={{lineHeight:1, fontSize:"0.9em"}}>BACK</Typography>
				</Button>
				<Button sx={{p:0}} onClick={() => navigate('/', {replace: true})}><img src={LogoImg} alt="" style={{maxWidth:85}}/></Button>
				<Button onClick={() => {navigate('/my-page')}} sx={{p:0, display:"flex", flexDirection:"column", gap:0.5}}>
					<FaceIcon sx={{fontSize:"1.2em"}}/>
					<Typography variant="button" sx={{lineHeight:1, fontSize:"0.9em"}}>MY</Typography>
				</Button>
			</Toolbar>
		</AppBar>
	)
}

export default Header;