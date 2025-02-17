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
		let errorMsg = 'API 요청 실패';
		if(error.response) {
			const statusCode = error.response.status;
			switch (statusCode) {
				case 400:
					errorMsg = '잘못된 요청입니다.';
					break;
				case 404:
					errorMsg = '요청한 리소스를 찾을 수 없습니다.';
					break;
				case 500:
					errorMsg = '서버 에러가 발생했습니다.';
					break;
				default:
					errorMsg = '알 수 없는 오류가 발생했습니다.';
			}

			error.message = errorMsg;

		} else if(error.request) {
			error.message = '서버 응답이 없습니다.';
		} else {
			error.message = '알 수 없는 오류가 발생했습니다.';
		}
		return Promise.reject(error);
	}
)


export default api;