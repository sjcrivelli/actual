import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useServerURL } from '@desktop-client/components/ServerContext';
import { useSelector } from '@desktop-client/redux';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const userData = useSelector(state => state.user.data);
    const serverUrl = useServerURL();
    const hasPermission = (permission) => {
        if (!permission) {
            return true;
        }
        return (!serverUrl ||
            userData?.permission?.toUpperCase() === permission?.toUpperCase());
    };
    return (_jsx(AuthContext.Provider, { value: { hasPermission }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
