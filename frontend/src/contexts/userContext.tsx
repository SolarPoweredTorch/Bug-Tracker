import { createContext, useEffect, useState } from 'react';
import { User } from "../models/user";
import * as UsersApi from "../network/users_api";

const UserContext = createContext
    <{
        loggedInUser: User | null,
        setLoggedInUser: (newUser: User | null) => void,
    }>
    ({
        loggedInUser: null,
        setLoggedInUser: () => undefined,
    });

const UserProvider = ({ children }: any) => { // change to specific type later?

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await UsersApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, []);

    return (
        <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };
