import React, {createContext, useContext,useState, ReactNode} from 'react';

interface UserType {
	id: string,
	nickname: string
}

interface UserContextType {
	user: UserType | null,
	setUser: (user:UserType | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({children} : {children: ReactNode}) => {
	const [user, setUser] = useState<UserType | null>(null);

	return (
		<UserContext.Provider value={{user, setUser}}>
			{children}
		</UserContext.Provider>
	)
}

const useUser = () => {
	const ctx = useContext(UserContext);
	return ctx;
}


export {UserProvider, useUser};