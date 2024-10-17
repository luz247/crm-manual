import React, { useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { LoginPages } from '../auth/LoginPages';
import { AppRouters } from './AppRouters';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AllRouters = () => {
    const { status, checkAuthToken } = useAuthStore();


    useEffect(() => {
        checkAuthToken();
        
    }, []);
    
    if (status === 'checking') {
        return <h3>Cargando...</h3>;
    }

    return (
        <Routes>
            {status === 'not-authenticated' ? (
                <>
                    <Route path="/auth/*" element={<LoginPages />} />
                    <Route path="/*" element={<Navigate to="/auth/login" />} />
                </>
            ) : (
                <>
                    <Route path="/*" element={<AppRouters />} />
                </>
            )}
        </Routes>
    );
};
