import React, { createContext, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user info, e.g., { id: 1, email: 'user@example.com' }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
