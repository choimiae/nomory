import React from 'react';
import {Box, Button, Card, CardActions, CardContent, Link, TextField, Typography} from '@mui/material';
import LogoImg from '../assets/logo.png';

const Login = () => {

	return (
		<>
			<Box
				component="div"
				sx={{p:2, pt:5, pb:5, display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#eee"}}
			>
				<Card sx={{ maxWidth: 450, width:"100%", pl:2, pr:2, pt:4, pb:4}}>
					<CardContent>
						<Box sx={{textAlign:"center"}}>
							<img src={LogoImg} alt="" style={{maxWidth:125}}/>
							<Typography component="h1" variant="h1" sx={{mt:1}}>로그인</Typography>
						</Box>
						<Box sx={{display:"flex", alignItems:"flex-end", gap:"0 10px"}}>
							<TextField
								autoFocus
								required
								margin="dense"
								label="아이디"
								type="text"
								fullWidth
								variant="standard"
							/>
						</Box>
						<TextField
							autoFocus
							required
							margin="dense"
							label="비밀번호"
							type="password"
							fullWidth
							variant="standard"
						/>
					</CardContent>
					<CardActions>
						<Button type="button" variant="contained" fullWidth>로그인</Button>
					</CardActions>
					<Box sx={{textAlign:"center", mt:1}}>
						<Link href="/register" underline="none" variant="body2">회원가입</Link>
					</Box>
				</Card>
			</Box>
		</>
	)
}

export default Login;