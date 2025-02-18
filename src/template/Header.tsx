import React from 'react';
import {Box, Link} from "@mui/material";
import LogoImg from "../assets/logo.png";

const Header:React.FC = () => {

	return (
		<Box component="header" sx={{p:2, pb:1.5}}>
			<Box component="h1">
				<Link href="/place/list"><img src={LogoImg} alt="" style={{maxWidth:"85px"}}/></Link>
			</Box>
		</Box>
	)
}

export default Header;