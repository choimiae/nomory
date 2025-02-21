import React, {ReactNode} from 'react';
import {Box, Container} from '@mui/material';
import Header from "./Header";

interface LayoutType {
	children: ReactNode
}

const Layout:React.FC<LayoutType> = ({ children }) => {
	return (
		<Box
			component="main"
			sx={{height:"100vh", display:"flex", flexDirection:"column"}}
		>
			<Header/>
			<Container component="section" sx={{p:[0,0,0], flex:"1 1 auto", maxWidth:["none", "none", "none"]}}>
				{children}
			</Container>
		</Box>
	)
}

export default Layout;