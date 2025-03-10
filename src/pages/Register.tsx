import React, {useState} from 'react';
import {Box, Button, Card, CardActions, CardContent, Link, TextField, Typography, Alert, AlertTitle} from '@mui/material';
import LogoImg from '../assets/logo.png';
import {UserInfoList, UserInfoType} from '../setup/interfaces';
import api from "../setup/api";
import {ToastAlert, ToastAlertType} from "../components/ToastAlert";


type RegUserInfoType = UserInfoType & {[UserInfoList.PW_CONFIRM] : string}

type ErrorInfoType = {
	[key in keyof RegUserInfoType]: {
		status: boolean;
		message: string;
	};
}

const Register:React.FC = () => {
	const defaultUser : RegUserInfoType = {
		[UserInfoList.ID]: '',
		[UserInfoList.PW]: '',
		[UserInfoList.PW_CONFIRM]: '',
		[UserInfoList.NICKNAME]: ''
	}
	const defaultErrors : ErrorInfoType = {
		[UserInfoList.ID]: {status:false, message:''},
		[UserInfoList.PW]: {status:false, message:''},
		[UserInfoList.PW_CONFIRM]: {status:false, message:''},
		[UserInfoList.NICKNAME]: {status:false, message:''},
	}
	const [user, setUser] = useState<RegUserInfoType>(defaultUser);
	const [errors, setErrors] = useState<ErrorInfoType>(defaultErrors);
	const [toast, setToast] = useState<ToastAlertType | null>(null);

	// 비밀번호 확인
	const passwordCheck = (event:React.ChangeEvent<HTMLInputElement>) => {
		inputChange(UserInfoList.PW_CONFIRM, event.target.value);
	}

	const inputChange = <K extends keyof RegUserInfoType>(key:K, value:RegUserInfoType[K]) => {
		let data = { status:false, message:'' };

		if(!value) {
			data = {status:true, message:'필수 입력값입니다.'}
		} else if(key === UserInfoList.PW_CONFIRM && user[UserInfoList.PW] !== value) {
			data = {status:true, message:'비밀번호가 일치하지 않습니다.'}
		}

		setErrors(prev => ({...prev, [key] : data}));
		setUser(prev => ({...prev, [key] : value}));
	}


	// 가입
	const join = async () => {
		let hasError = false;
		for(const [key, value] of Object.entries(user)) {
			const errorData = value ? {status:false, message:''} : {status:true, message:'필수 입력값입니다.'}

			if (errorData.status) hasError = true;

			setErrors(prev => ({...prev, [key] : errorData}));
		}

		if(!hasError) {
			const response = await api.post<UserInfoType>('/user', user);

			if(response.status === 201) {

			} else {

			}
		}

	}

	return (
		<>
			<Box
				component="div"
				sx={{p:2, pt:5, pb:5, display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#eee"}}
			>
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
								error={errors[UserInfoList.ID].status}
								helperText={errors[UserInfoList.ID].message}
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
							error={errors[UserInfoList.PW].status}
							helperText={errors[UserInfoList.PW].message}
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
							error={errors[UserInfoList.PW_CONFIRM].status}
							helperText={errors[UserInfoList.PW_CONFIRM].message}
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
							error={errors[UserInfoList.NICKNAME].status}
							helperText={errors[UserInfoList.NICKNAME].message}
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

			{/* 알림 :: 토스트 */}
			{ toast && toast.open ? <ToastAlert open={toast.open} type={toast.type} message={toast.message}  onClose={toast.onClose} /> : '' }
		</>
	)
}

export default Register;