import React, {ChangeEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Card, CardActions, CardContent, Link, TextField, Typography} from '@mui/material';
import LogoImg from '../assets/logo.png';
import api from '../setup/api';
import {UserInfoList, UserInfoType} from '../setup/interfaces';
import {ToastAlert, ToastAlertType} from '../components/ToastAlert';

type RegUserInfoType = UserInfoType & {[UserInfoList.PW_CONFIRM] : string}
type ErrorInfoType = {
	[key in keyof RegUserInfoType]: {
		status: boolean;
		message: string;
	}
}

const Register:React.FC = () => {
	const navigate = useNavigate();
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
		[UserInfoList.NICKNAME]: {status:false, message:''}
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

	// 아이디 중복체크
	const idCheck = async () => {
		if(!user[UserInfoList.ID]) {
			setErrors(prev => ({...prev, [UserInfoList.ID] : {status:true, message:'필수 입력값입니다.'}}));
		} else {
			const response = await api.get('/user/check', {params: {id: user[UserInfoList.ID]}});
			const toastType = response.data.success ? 'success' : 'warning';

			setToast({
				open: true,
				type: toastType,
				message: response.data.message,
				onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null))
			});
		}
	}


	// 가입
	const join = async () => {
		let hasError = false;

		if(Object.values(errors).some(error => error.status))
			return;

		for(const [key, value] of Object.entries(user)) {
			const errorData = value ? {status:false, message:''} : {status:true, message:'필수 입력값입니다.'}

			if (errorData.status)
				hasError = true;

			setErrors(prev => ({...prev, [key] : errorData}));
		}

		if(!hasError) {
			const response = await api.post<UserInfoType>('/user', user);
			if(response.status === 201) {
				setToast({
					open: true,
					type: 'success',
					message: '회원가입이 완료되었습니다.',
					onClose: () => {navigate('/login');}
				});
			} else {
				setToast({
					open: true,
					type: 'warning',
					message: '오류가 발생했습니다.<br>잠시 후 다시 시도해 주세요.',
					onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null))
				});
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
						<Box sx={{position:"relative"}}>
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
								sx={{pr:"80px"}}
								onChange={(event) => {inputChange(UserInfoList.ID, event.target.value)}}
								onKeyDown={(event:React.KeyboardEvent<HTMLInputElement>) => {if(event.key === 'Enter') idCheck();}}
							/>
							<Button type="button" variant="outlined" sx={{position:"absolute", right:0, top:"20px"}} onClick={idCheck}>중복체크</Button>
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