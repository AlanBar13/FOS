import { createContext, useContext, useState, PropsWithChildren } from 'react';

interface UserData {
    token: string
    username: string
    role: string
}

interface UserContextType {
    user: UserData | null
    setUser: (userData: UserData) => void
}

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context){
        throw new Error('useUser must be used within an UserProvider');
    }

    return context;
}

export const UserProvider = ({ children }: PropsWithChildren) => {
    const [user, setUserData] = useState<UserData | null>(null);

    const setUser = (data: UserData | null) => {
        setUserData(data);
    }

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}