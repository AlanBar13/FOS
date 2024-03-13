import { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';

const userKey = "fos:user";

export interface UserData {
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
        const userStorage = localStorage.getItem(userKey);
        if(userStorage !== null) {
            localStorage.removeItem(userKey);
        }

        localStorage.setItem(userKey, JSON.stringify(data))
    }

    useEffect(() => {
        const userStorage = localStorage.getItem(userKey);
        if(userStorage !== null) {
            const userData = JSON.parse(userStorage) as UserData;
            setUserData(userData);
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}