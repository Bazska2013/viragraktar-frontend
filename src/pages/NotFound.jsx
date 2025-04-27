import {H1, H2, H4, Paragraph, Square} from "tamagui";
import {ShoppingCart, Store, User} from "@tamagui/lucide-icons";
import {BigButton, VerticalContainer} from "../tamagui.config.ts";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const NotFound = () => {

    const [currentIcon, setCurrentIcon] = useState('store');
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
                navigate('/profile', { replace: true });
            });
        } else {
            navigate('/profile', { replace: true });
        }
    }, [navigate]);

    return (
    <VerticalContainer alignItems="center">
        <H1 fontSize={screenSize > 1280 ? 400 : 200} marginTop={screenSize > 1280 ? 100 : 50} marginBottom={screenSize > 1280 ? 150 : 50}>404</H1>
        <H4>Page not found</H4>
        <BigButton onPress={handleNavigateBack}>Navigate to the Profile page</BigButton>
        <VerticalContainer alignItems="center">
            <Square position="absolute" animation="slow" opacity={currentIcon === 'store' ? 1 : 0} rotate={currentIcon === 'store' ? '0deg' : '360deg'} scale={currentIcon === 'store' ? 1 : 0}>
                <Store size="$10" />
            </Square>
            <Square position="absolute" animation="slow" opacity={currentIcon === 'cart' ? 1 : 0} rotate={currentIcon === 'cart' ? '360deg' : '0deg'} scale={currentIcon === 'cart' ? 1 : 0}>
                <ShoppingCart size="$10" />
            </Square>
            <Square position="absolute" animation="slow" opacity={currentIcon === 'profile' ? 1 : 0} rotate={currentIcon === 'profile' ? '0deg' : '360deg'} scale={currentIcon === 'profile' ? 1 : 0}>
                <User size="$10" />
            </Square>
        </VerticalContainer>
    </VerticalContainer>
    )
}

export default React.memo(NotFound);