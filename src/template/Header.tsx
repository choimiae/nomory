import React from 'react';
import {Box, Link} from "@mui/material";
import LogoImg from "../assets/logo.png";

const Header:React.FC = () => {

	return (
		<Box component="header" sx={{p:2, textAlign:"center"}}>
			<Box component="div" sx={{mb:1}}>
				<Link href="/list"><img src={LogoImg} alt="" style={{maxWidth:"100px"}}/></Link>
			</Box>
		</Box>
	)
}

export default Header;