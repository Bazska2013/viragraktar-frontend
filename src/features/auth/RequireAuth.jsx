import { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { Navigate } from "react-router-dom";
import { selectAuth } from "./authSlice";
import axios from "../../axiosConfig.js";
import {setUser} from "./userSlice.js";

export const RequireAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const auth = useSelector(selectAuth);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('/sanctum/csrf-cookie', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                const response = await axios.get('/api/user', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    dispatch(setUser(response.data));
                }
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [auth]);

    if (isLoading) {
        return <div>Loading...</div>;  // Optional loading indicator
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};