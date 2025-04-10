import React, {useState} from 'react';
import {Box, Link, Stack} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import LogoImg from '../assets/logo.png';
import {useUser} from '../contexts/UserContext';

const Header:React.FC = () => {
	const { user } = useUser();
	const [anchorElem, setAnchorElem] = useState<HTMLElement | null>(null);

	return (
		<Stack component="header" direction="row" alignItems="center" justifyContent="space-between" sx={{p:2, pb:1.5}}>
			<Box component="h1">
				<Link href="/"><img src={LogoImg} alt="" style={{maxWidth:85}}/></Link>
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
				>
					<MenuItem onClick={()=>{setAnchorElem(null);}}>로그아웃</MenuItem>
				</Menu>
			</div>
		</Stack>
	)
}

export default Header;