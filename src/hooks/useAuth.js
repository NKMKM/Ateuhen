import { useEffect, useState } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1]; 

        setIsAuthenticated(!!token); 
    }, []);

    return { isAuthenticated };
};

export default useAuth;
