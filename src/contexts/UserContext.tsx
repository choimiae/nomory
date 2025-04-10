import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import api from '../setup/api';

interface UserType {
	id: string,
	nickname: string
}

interface UserContextType {
	user: UserType | null,
	setUser: (user:UserType | null) => void,
	loading: boolean
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({children} : {children: ReactNode}) => {
	const [user, setUser] = useState<UserType | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const verifyToken = async () => {
			const token = localStorage.getItem('token');

			if(token) {
				try {
					const response = await api.get('/auth/verify', {headers: {Authorization: `Bearer ${token}`}});
					setUser(response.data.user);
				} catch (err) {
					setUser(null);
				}
			}

			setLoading(false);
		}

		verifyToken();
	}, []);

	return (
		<UserContext.Provider value={{user, setUser, loading}}>
			{children}
		</UserContext.Provider>
	)
}

const useUser = () => {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("사용자 정보가 없습니다.");
	return ctx;
}


export {UserContext, UserProvider, useUser};