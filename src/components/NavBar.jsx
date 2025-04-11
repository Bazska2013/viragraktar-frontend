import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../features/auth/userSlice.js";
import {selectStore} from "../features/store/storeSlice.js";
import React, {useEffect, useState} from "react";
import {SizableText, Tabs, XStack} from "tamagui";
import {ShoppingCart, Store, User} from "@tamagui/lucide-icons";

const NavBar = () => {
    const currentPage = window.location.pathname;
    const [currentTab, setCurrentTab] = useState(currentPage === '/sell' ? 'sell' : currentPage === '/buy' ? 'buy' : 'profile');
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);
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
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setCurrentTab(currentPage === '/sell' ? 'sell' : currentPage === '/buy' ? 'buy' : currentPage === '/profile' ? 'profile' : '');
    }, [currentPage]);

    const handleNavigation = (value) => {
        setCurrentTab(value);
        const pathMap = {
            sell: '/sell',
            buy: '/buy',
            profile: '/profile'
        };

        const newPath = pathMap[value];
        if (!newPath) return;

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate(newPath, { replace: true });
            });
        } else {
            // fallback for unsupported browsers
            navigate(newPath, { replace: true });
        }
    };

    return (
        <XStack
            flex={1}
            alignItems="center"
            width="100%"
            justifyContent="center"
            top={scrollY > 0 ? '1rem' : '0'}
            position="fixed"
            zIndex={1000}
            animation="bouncy"
        >
            <div style={{backdropFilter: 'blur(7px)', borderRadius: '10px', border: 'none'}}>
                {(user && store) &&
                    <Tabs value={currentTab} onValueChange={(value) => handleNavigation(value)}
                          borderRadius="10px"
                          boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                    >
                        <Tabs.List
                            width="100%"
                            justifyContent="center"
                            alignItems="center"
                            backgroundColor="transparent"
                        >
                            {user.is_seller &&
                                <Tabs.Tab
                                    backgroundColor="transparent"
                                    hoverStyle={{
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(5px)',
                                    }}
                                    focusStyle={{
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(1px)',
                                        backgroundColor: 'rgb(255, 255, 255)',
                                    }}
                                    value="sell" width={screenSize > 1280 ? '200px' : screenSize > 768 ? '150px' : '120px'}
                                    gap="$5"
                                >
                                    <Store />
                                    <SizableText>Sell</SizableText>
                                </Tabs.Tab>
                            }
                            {user.is_buyer &&
                                <Tabs.Tab
                                    backgroundColor="transparent"
                                    hoverStyle={{
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(5px)',
                                    }}
                                    focusStyle={{
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(1px)',
                                        backgroundColor: 'rgb(255, 255, 255)',
                                    }}
                                    value="buy" width={screenSize > 1280 ? '200px' : screenSize > 768 ? '150px' : '120px'}
                                    gap="$5"
                                >
                                    <ShoppingCart />
                                    <SizableText>Buy</SizableText>
                                </Tabs.Tab>
                            }
                            <Tabs.Tab
                                backgroundColor="transparent"
                                hoverStyle={{
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(5px)',
                                }}
                                focusStyle={{
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(1px)',
                                    backgroundColor: 'rgb(255, 255, 255)',
                                }}
                                value="profile" width={screenSize > 1280 ? '200px' : screenSize > 768 ? '150px' : '120px'}
                                gap="$5"
                            >
                                <User />
                                <SizableText>Profile</SizableText>
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                }
            </div>
        </XStack>
    )
}

export default React.memo(NavBar);