import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

const api:AxiosInstance = axios.create({
	baseURL: 'http://localhost:3001',
	timeout: 5000,
	headers: {
		'Content-type' : 'application/json'
	}
});


// 요청 인터셉터
api.interceptors.request.use (
	(config:InternalAxiosRequestConfig) : InternalAxiosRequestConfig => {
		return config;
	},
	(error:AxiosError) : Promise<AxiosError> => {
		return Promise.reject(error);
	}
)


// 응답 인터셉터
api.interceptors.response.use(
	(response:AxiosResponse): AxiosResponse => response,
	(error:AxiosError) : Promise<AxiosError> => {
		console.log('❌ FAIL - API RESPONSE ERROR');
		return Promise.reject(error);
	}
)


export default api;