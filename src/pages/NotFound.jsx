import {H1, H4, Square} from "tamagui";
import {ShoppingCart, Store, User} from "lucide-react";
import {BigButton, VerticalContainer} from "../tamagui.config.ts";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../features/auth/userSlice.js";

const NotFound = () => {

    const [currentIcon, setCurrentIcon] = useState('store');
    const user = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIcon((prevIcon) => {
                if (prevIcon === 'store') {
                    return 'cart';
                } else if (prevIcon === 'cart') {
                    return 'profile';
                } else {
                    return 'store';
                }
            });
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const handleNavigateBack = useCallback(() => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                if (user) {
                    navigate('/profile', { replace: true });
                } else {
                    navigate('/login', { replace: true });
                }
            });
        } else {
            if (user) {
                navigate('/profile', { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [navigate, user]);

    return (
    <VerticalContainer alignItems="center">
        <H1 fontSize={screenSize > 1280 ? 400 : 200} marginTop={screenSize > 1280 ? 100 : 50} marginBottom={screenSize > 1280 ? 150 : 50}>404</H1>
        <H4>Page not found</H4>
        <BigButton onPress={handleNavigateBack}>{user ? 'Navigate to the Profile page' : 'Navigate to the Login page'}</BigButton>
        <VerticalContainer alignItems="center">
            <Square position="absolute" animation="slow" opacity={currentIcon === 'store' ? 1 : 0} rotate={currentIcon === 'store' ? '0deg' : '360deg'} scale={currentIcon === 'store' ? 1 : 0}>
                <Store size={150} />
            </Square>
            <Square position="absolute" animation="slow" opacity={currentIcon === 'cart' ? 1 : 0} rotate={currentIcon === 'cart' ? '360deg' : '0deg'} scale={currentIcon === 'cart' ? 1 : 0}>
                <ShoppingCart size={150} />
            </Square>
            <Square position="absolute" animation="slow" opacity={currentIcon === 'profile' ? 1 : 0} rotate={currentIcon === 'profile' ? '0deg' : '360deg'} scale={currentIcon === 'profile' ? 1 : 0}>
                <User size={150} />
            </Square>
        </VerticalContainer>
    </VerticalContainer>
    )
}

export default React.memo(NotFound);