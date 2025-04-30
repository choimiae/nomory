import React, {useState} from 'react';
import {Box, Button, Card, CardActions, CardContent, Link, TextField, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import LogoImg from '../assets/logo.png';
import {UserInfoList, UserInfoType} from '../setup/interfaces';
import api from '../setup/api';
import {ToastAlert, ToastAlertType} from '../components/ToastAlert';
import {useUser} from '../contexts/UserContext';

type LoginUserInfoType = Omit<UserInfoType, 'nickname'>
type ErrorInfoType = {
	[key in keyof LoginUserInfoType]: {
		status: boolean;
		message: string;
	}
}

const Login = () => {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState<LoginUserInfoType>({[UserInfoList.ID]: '', [UserInfoList.PW]: ''});
	const [errors, setErrors] = useState<ErrorInfoType>({[UserInfoList.ID]: {status:false, message:''}, [UserInfoList.PW]: {status:false, message:''}});
	const [toast, setToast] = useState<ToastAlertType | null>(null);
	const { setUser } = useUser();

	const inputChange = <K extends keyof LoginUserInfoType>(key:K, value:LoginUserInfoType[K]) => {
		setUserInfo(prev => ({...prev, [key] : value}));
	}

	const login = async () => {
		let hasError = false;
		for(const [key, value] of Object.entries(userInfo)) {
			const errorData = value ? {status:false, message:''} : {status:true, message:'필수 입력 값입니다.'}

			if (errorData.status)
				hasError = true;

			setErrors(prev => ({...prev, [key] : errorData}));
		}

		if(!hasError) {
			const response = await api.post('/auth/login', userInfo);

			if(response.data.success) {
				localStorage.setItem('token', response.data.token);
				setUser({id:response.data.id, nickname: response.data.nickname});
				navigate('/place/list');
			} else {
				setToast({
					open: true,
					type: 'warning',
					message: response.data.message,
					onClose: () => setToast((prev) => (prev ? { ...prev, open: false } : null))
				});

				localStorage.removeItem('token');
				setUser(null);
			}
		}
	}

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
							onKeyDown={(event:React.KeyboardEvent<HTMLInputElement>) => {if(event.key === 'Enter') login();}}
							onChange={(event) => {inputChange(UserInfoList.PW, event.target.value)}}
						/>
					</CardContent>
					<CardActions>
						<Button type="button" variant="contained" fullWidth onClick={login}>로그인</Button>
					</CardActions>
					<Box sx={{textAlign:"center", mt:1}}>
						<Link href="/register" underline="none" variant="body2">회원가입</Link>
					</Box>
				</Card>
			</Box>

			{/* 알림 :: 토스트 */}
			{ toast && toast.open ? <ToastAlert open={toast.open} type={toast.type} message={toast.message}  onClose={toast.onClose} /> : '' }
		</>
	)
}

export default Login;