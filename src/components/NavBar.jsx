import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser} from "../features/auth/userSlice.js";
import {selectStore} from "../features/store/storeSlice.js";
import {useEffect, useState} from "react";
import {SizableText, Tabs, XStack} from "tamagui";
import {ShoppingCart, Store, User} from "@tamagui/lucide-icons";

const NavBar = () => {
    const currentPage = window.location.pathname;
    const [currentTab, setCurrentTab] = useState(currentPage === '/sell' ? 'sell' : currentPage === '/buy' ? 'buy' : 'profile');
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);
    const windowWidth = window.innerWidth;
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
        switch (value) {
            case 'sell':
                navigate('/sell', {replace: true});
                break;
            case 'buy':
                navigate('/buy', {replace: true});
                break;
            case 'profile':
                navigate('/profile', {replace: true});
                break;
            default:
                break;
        }
    }



    return (
        <XStack
            flex={1}
            alignItems="center"
            justifyContent="center"
        >
            {(user && store) &&
                <Tabs value={currentTab} onValueChange={(value) => handleNavigation(value)}
                      top={scrollY > 0 ? '1rem' : '0'}
                      position="fixed"
                      zIndex={1000}
                      animation="bouncy"
                >
                    <Tabs.List
                        width="100%"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {user.is_seller &&
                            <Tabs.Tab
                                backgroundColor='rgba(246, 245, 244, 0.95)'
                                hoverStyle={{
                                    backgroundColor: 'rgba(246, 245, 244, 0.95)',
                                    cursor: 'pointer',
                                    borderColor: '#8E8B7C',
                                    borderWidth: '1px',
                                }}
                                focusStyle={{
                                    backgroundColor: 'rgba(237, 235, 233, 0.97)',
                                    cursor: 'pointer',
                                }}
                                value="sell" width={windowWidth > 1280 ? '200px' : windowWidth > 768 ? '150px' : '120px'}
                                gap="$5"
                            >
                                <Store />
                                <SizableText>Sell</SizableText>
                            </Tabs.Tab>
                        }
                        {user.is_buyer &&
                            <Tabs.Tab
                                backgroundColor='rgba(246, 245, 244, 0.95)'
                                hoverStyle={{
                                    backgroundColor: 'rgba(246, 245, 244, 0.95)',
                                    cursor: 'pointer',
                                    borderColor: '#8E8B7C',
                                    borderWidth: '1px',
                                }}
                                focusStyle={{
                                    backgroundColor: 'rgba(237, 235, 233, 0.97)',
                                    cursor: 'pointer',
                                }}
                                value="buy" width={windowWidth > 1280 ? '200px' : windowWidth > 768 ? '150px' : '120px'}
                                gap="$5"
                            >
                                <ShoppingCart />
                                <SizableText>Buy</SizableText>
                            </Tabs.Tab>
                        }
                        <Tabs.Tab
                            backgroundColor='rgba(246, 245, 244, 0.95)'
                            hoverStyle={{
                                backgroundColor: 'rgba(246, 245, 244, 0.95)',
                                cursor: 'pointer',
                                borderColor: '#8E8B7C',
                                borderWidth: '1px',
                            }}
                            focusStyle={{
                                backgroundColor: 'rgba(237, 235, 233, 0.97)',
                                cursor: 'pointer',
                            }}
                            value="profile" width={windowWidth > 1280 ? '200px' : windowWidth > 768 ? '150px' : '120px'}
                            gap="$5"
                        >
                            <User />
                            <SizableText>Profile</SizableText>
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            }
        </XStack>
    )
}

export default NavBar;