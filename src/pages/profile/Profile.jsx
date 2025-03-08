import {Card, Col, Fade, Row} from "react-bootstrap";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../../features/auth/userSlice.js";
import {useEffect, useState} from "react";
import {deleteStore, selectStore} from "../../features/store/storeSlice.js";
import StoreUsers from "../../components/store/StoreUsers.jsx";
import {YStack, Button, Spinner, XStack, H3, SizableText, Accordion, Paragraph, Square} from "tamagui";
import {ChevronDown, LogOut, PenSquare, RefreshCw, UserPen} from "@tamagui/lucide-icons";
import {
    VerticalContainer,
    HorizontalContainer,
    SmallButton,
    BigButton,
    SmallButtonWithAccent
} from "../../tamagui.config.ts";
import {logout} from "../../features/auth/authSlice.js";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);
    const [storeId, setStoreId] = useState(null);
    const [storeIdVisible, setStoreIdVisible] = useState(false);
    const [profit, setProfit] = useState(0);
    const [isProfitLoading, setIsProfitLoading] = useState(false);
    const [profitError, setProfitError] = useState(null);
    const [isStoreIdLoading, setIsStoreIdLoading] = useState(false);
    const [storeIdError, setStoreIdError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout').then(() => {
                setIsLoading(true);
            })
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(logout());
            dispatch(removeUser());
            dispatch(deleteStore());
            setIsLoading(false);
            navigate('/login', {replace: true});
        }
    }

    const getTodayProfit = async () => {
        let response;
        setIsProfitLoading(true);
        try {
            response = await axios.get('/api/store/profit/today');
        } catch (error) {
            setIsProfitLoading(false);
            setProfitError(error.response.data.message);
        } finally {
            setIsProfitLoading(false);
            if (response?.status === 200) {
                setProfit(response.data);
            }
        }
    }

    const handleShowStoreId = async () => {
        let response;
        setIsStoreIdLoading(true);
        try {
            response = await axios.get('/api/store/id');
        } catch (error) {
            setIsStoreIdLoading(false);
            setStoreIdError(error.response.data.message);
        } finally {
            setIsStoreIdLoading(false);
            if (response?.status === 200) {
                setStoreId(response.data);
            }
        }
    }

    useEffect(() => {
        if (store) {
            getTodayProfit();
            handleShowStoreId();
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            handleShowStoreId();
        }, 30000); // 30000 milliseconds = 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <VerticalContainer>
            {!isLoading ? <>
                <HorizontalContainer>
                        <VerticalContainer>
                            <H3>User info</H3>
                            <SizableText>Name: {user.name}</SizableText>
                            <SizableText>Email: {user.email}</SizableText>
                            <BigButton icon={UserPen} onClick={() => navigate('/edit/profile')}>Edit profile</BigButton>
                            <SmallButtonWithAccent icon={LogOut} onClick={() => handleLogout()}>Logout</SmallButtonWithAccent>
                        </VerticalContainer>
                        {store ?
                            <VerticalContainer>
                                <H3>Store info</H3>
                                <SizableText>Store name: {store.name}</SizableText>
                                <HorizontalContainer>
                                    <SizableText>{profitError ? profitError : "Today's profit: " + profit}</SizableText>
                                    <SmallButton iconAfter={
                                        <Square animation='slow' rotate={isProfitLoading ? '360deg' : '0deg'}>
                                            <RefreshCw size="$1" />
                                        </Square>
                                    } onClick={() => {getTodayProfit()}} >Refresh</SmallButton>
                                </HorizontalContainer>
                                <Accordion overflow="hidden" type="single" collapsible>
                                    <Accordion.Item value="store">
                                        <Accordion.Header>
                                            <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                                                {({open}) => (
                                                    <>
                                                        <Paragraph>{open ? 'Hide' : 'Show'} Store ID</Paragraph>
                                                        <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                                            <ChevronDown /*size="$1"*/ />
                                                        </Square>
                                                    </>
                                                )}
                                            </Accordion.Trigger>
                                        </Accordion.Header>
                                        <Accordion.HeightAnimator animation="medium">
                                            <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
                                                <Paragraph>{isStoreIdLoading ? <Spinner /*size="$1"*/ /> : storeId}</Paragraph>
                                            </Accordion.Content>
                                        </Accordion.HeightAnimator>
                                        <Accordion.Content />
                                    </Accordion.Item>
                                </Accordion>
                                {user.is_admin && <BigButton icon={PenSquare} onClick={() => navigate('/edit/store')}>Edit store</BigButton>}
                            </VerticalContainer> : <>
                            <SmallButton onClick={() => navigate('/new/store', {replace: true})}>Join or Create a Store</SmallButton>
                        </>}
                </HorizontalContainer>
                <HorizontalContainer>
                    {store && user.is_admin ? <>
                        <StoreUsers />
                    </> : <></>}
                </HorizontalContainer>
            </> : <>
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </>}
        </VerticalContainer>
    )
}

export default Profile;