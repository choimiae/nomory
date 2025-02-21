import React from 'react';
import {Box, Button, TextField, Typography, Card, CardContent, CardActions} from '@mui/material';
import LogoImg from "../assets/logo.png";

const Register:React.FC = () => {
	return (
		<Box component="div" sx={{p:2, pt:5, pb:5, display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#eee"}}>
			<Card sx={{ maxWidth: 450, pl:2, pr:2, pt:4, pb:4}}>
				<CardContent>
					<Box sx={{textAlign:"center"}}>
						<img src={LogoImg} alt="" style={{maxWidth:125}}/>
						<Typography component="h1" variant="h1" sx={{mt:1}}>회원가입</Typography>
					</Box>
					<TextField
						autoFocus
						required
						margin="dense"
						label="아이디"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						label="비밀번호"
						type="password"
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						label="비밀번호 확인"
						type="password"
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						label="닉네임"
						type="text"
						fullWidth
						variant="standard"
					/>
					<Box sx={{display:"flex", gap:"0 10px", mt:3}}>
					</Box>
				</CardContent>
				<CardActions>
					<Button variant='outlined' sx={{flex:"1 1 auto"}}>취소</Button>
					<Button type="button" variant="contained" sx={{flex:"0 0 60%"}}>가입하기</Button>
				</CardActions>
			</Card>
		</Box>
	)
}

export default Register;