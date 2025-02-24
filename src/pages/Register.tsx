import React, {useState} from 'react';
import {Box, Button, Card, CardActions, CardContent, Link, TextField, Typography} from '@mui/material';
import LogoImg from '../assets/logo.png';
import {UserInfoList, UserInfoType} from '../setup/interfaces';


interface RegUserInfoType extends UserInfoType {
	[UserInfoList.PW_CONFIRM] : string;
}

const Register:React.FC = () => {
	const defaultUser : RegUserInfoType = {
		[UserInfoList.ID]: '',
		[UserInfoList.PW]: '',
		[UserInfoList.PW_CONFIRM]: '',
		[UserInfoList.NICKNAME]: ''
	}
	const [user, setUser] = useState<RegUserInfoType>(defaultUser);

	// 비밀번호 확인
	const passwordCheck = (event:React.ChangeEvent<HTMLInputElement>) => {
		inputChange(UserInfoList.PW_CONFIRM, event.target.value);
	}

	const inputChange = <K extends keyof RegUserInfoType>(key:K, value:RegUserInfoType[K]) => {

		setUser(prev => prev ? {...prev, [key] : value} : {...defaultUser, [key] : value});
	}


	// 가입
	const join = () => {

	}

	return (
		<>
			<Box component="div" sx={{p:2, pt:5, pb:5, display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#eee"}}>
				<Card sx={{ maxWidth: 450, pl:2, pr:2, pt:4, pb:4}}>
					<CardContent>
						<Box sx={{textAlign:"center"}}>
							<img src={LogoImg} alt="" style={{maxWidth:125}}/>
							<Typography component="h1" variant="h1" sx={{mt:1}}>회원가입</Typography>
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
								onChange={(event) => {inputChange(UserInfoList.ID, event.target.value)}}
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
							onChange={(event) => {inputChange(UserInfoList.PW, event.target.value)}}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							label="비밀번호 확인"
							type="password"
							fullWidth
							variant="standard"
							onChange={passwordCheck}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							label="닉네임"
							type="text"
							fullWidth
							variant="standard"
							onChange={(event) => {inputChange(UserInfoList.NICKNAME, event.target.value)}}
						/>
					</CardContent>
					<CardActions>
						<Button type="button" variant="contained" fullWidth onClick={join}>가입하기</Button>
					</CardActions>
					<Box sx={{textAlign:"center", mt:1}}>
						<Link href="/login" underline="none" variant="body2">로그인하기</Link>
					</Box>
				</Card>
			</Box>
		</>
	)
}

export default Register;