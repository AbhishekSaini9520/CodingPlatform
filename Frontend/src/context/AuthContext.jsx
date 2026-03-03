import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getProfile, registerUser } from '../api/auth.api';
import { getSolvedQuestion } from '../api/problem.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            // get basic user
            const profileData = await getProfile();

            // get solved problems
            const solvedData = await getSolvedQuestion();

            // attach solved problems to user
            const updatedUser = {
                ...profileData,
                problemSolved: solvedData.problemSolved || []
            };

            setUser(updatedUser);

        } catch (error) {
            console.error("Failed to load user profile:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            if (data.user) {
                setUser(data.user);
            } else {
                await loadUser();
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await registerUser(userData);
            if (data.user) {
                setUser(data.user);
            } else {
                await loadUser();
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    // console.log("inside the useAuth");
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
