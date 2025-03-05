import {Card, Col, Fade, Row} from "react-bootstrap";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../features/auth/userSlice.js";
import {useEffect, useState} from "react";
import {selectStore} from "../../features/store/storeSlice.js";
import StoreUsers from "../../components/store/StoreUsers.jsx";
import {YStack, Button, Spinner, XStack, H3, SizableText, Accordion, Paragraph, Square} from "tamagui";
import {ChevronDown, PenSquare, RefreshCw, UserPen} from "@tamagui/lucide-icons";

const Profile = () => {
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
        <YStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$2"
            padding="$2"
            justifyContent="space-between"
        >
            {user ? <>
                    <XStack
                        flex={1}
                        borderWidth={2}
                        borderColor="$color"
                        borderRadius="$4"
                        gap="$2"
                        padding="$2"
                        justifyContent="space-between"
                    >
                        <YStack
                            flex={1}
                            borderWidth={2}
                            borderColor="$color"
                            borderRadius="$4"
                            gap="$2"
                            padding="$2"
                            justifyContent="space-between"
                        >
                            <H3>User info</H3>
                            <SizableText>Name: {user.name}</SizableText>
                            <SizableText>Email: {user.email}</SizableText>
                            <Button icon={UserPen} theme="accent" size="$6" onClick={() => navigate('/edit/profile')}>Edit profile</Button>
                        </YStack>
                        {store ?
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                                justifyContent="space-between"
                            >
                                <H3>Store info</H3>
                                <SizableText>Store name: {store.name}</SizableText>
                                <XStack>
                                    <SizableText>{profitError ? profitError : "Today's profit: " + profit}</SizableText>
                                    <Button iconAfter={
                                        <Square animation='slow' rotate={isProfitLoading ? '360deg' : '0deg'}>
                                            <RefreshCw size="$1" />
                                        </Square>
                                    } size="$3" onClick={() => {getTodayProfit()}} >Refresh</Button>
                                </XStack>
                                <Accordion overflow="hidden" type="single" collapsible>
                                    <Accordion.Item value="store">
                                        <Accordion.Header>
                                            <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                                                {({open}) => (
                                                    <>
                                                        <Paragraph>{open ? 'Hide' : 'Show'} Store ID</Paragraph>
                                                        <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                                            <ChevronDown size="$1" />
                                                        </Square>
                                                    </>
                                                )}
                                            </Accordion.Trigger>
                                        </Accordion.Header>
                                        <Accordion.HeightAnimator animation="medium">
                                            <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
                                                <Paragraph>{isStoreIdLoading ? <Spinner size="$1" /> : storeId}</Paragraph>
                                            </Accordion.Content>
                                        </Accordion.HeightAnimator>
                                        <Accordion.Content />
                                    </Accordion.Item>
                                </Accordion>
                                {user.is_admin && <Button icon={PenSquare} theme="accent" size="$6" onClick={() => navigate('/edit/store')}>Edit store</Button>}
                        </YStack> : <>
                            <Button onClick={() => navigate('/new/store', {replace: true})}>Join or Create a Store</Button>
                        </>}
                    </XStack>
                    <XStack
                        flex={1}
                        borderWidth={2}
                        borderColor="$color"
                        borderRadius="$4"
                        gap="$2"
                        padding="$2"
                        justifyContent="space-between"
                    >
                        {store && user.is_admin ? <>
                            <StoreUsers />
                        </> : <></>}
                    </XStack>
            </> : <>
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </>}
        </YStack>
    )
}

export default Profile;