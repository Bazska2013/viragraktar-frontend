import {Card, Col, Fade, Row} from "react-bootstrap";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../../features/auth/userSlice.js";
import {useEffect, useState} from "react";
import {deleteStore, selectStore} from "../../features/store/storeSlice.js";
import StoreUsers from "../../components/store/StoreUsers.jsx";
import {
    YStack,
    Button,
    Spinner,
    XStack,
    H3,
    SizableText,
    Accordion,
    Paragraph,
    Square,
    Separator,
    Group
} from "tamagui";
import {
    BookKey, BookUser, Calendar,
    ChevronDown,
    ChevronRight, DollarSign, FilePen,
    LogOut,
    PenSquare,
    RefreshCw, TextSearch,
    UserPen,
    UserSearch
} from "@tamagui/lucide-icons";
import {
    VerticalContainer,
    HorizontalContainer,
    SmallButton,
    BigButton,
    SmallButtonWithAccent, StyledListItem
} from "../../tamagui.config.ts";
import {logout} from "../../features/auth/authSlice.js";
import ProfileDetails from "../../components/profile/ProfileDetails.jsx";
import ChangeName from "../../components/profile/ChangeName.jsx";
import ChangePassword from "../../components/profile/ChangePassword.jsx";
import StoreDetails from "../../components/profile/StoreDetails.jsx";

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
    const [currentPage, setCurrentPage] = useState('profileDetails');

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
                <HorizontalContainer flex={1}>
                    <VerticalContainer flex={2}>
                        <SizableText>User settings</SizableText>
                        <Group orientation="vertical"
                               boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                               separator={<Separator />}
                        >
                            <Group.Item>
                                <StyledListItem
                                    title="Profile details"
                                    icon={UserSearch}
                                    iconAfter={ChevronRight}
                                    onClick={() => {setCurrentPage('profileDetails')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change profile name"
                                    icon={UserPen}
                                    iconAfter={ChevronRight}
                                    onClick={() => {setCurrentPage('changeName')}}
                                />
                            </Group.Item>
                            <Group.Item>
                                <StyledListItem
                                    title="Change password"
                                    icon={BookKey}
                                    iconAfter={ChevronRight}
                                    onClick={() => {setCurrentPage('changePassword')}}
                                />
                            </Group.Item>
                        </Group>
                        {store ? <>
                            <SizableText>Store settings</SizableText>
                            <Group orientation="vertical"
                                   boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                                   separator={<Separator />}
                            >
                                <Group.Item>
                                    <StyledListItem
                                        title="Store details"
                                        icon={TextSearch}
                                        iconAfter={ChevronRight}
                                        onClick={() => {setCurrentPage('storeDetails')}}
                                    />
                                </Group.Item>
                                {user.is_admin && <>
                                    <Group.Item>
                                        <StyledListItem
                                            title="Change store name"
                                            icon={FilePen}
                                            iconAfter={ChevronRight}
                                        />
                                    </Group.Item>
                                    <Group.Item>
                                        <StyledListItem
                                            title="Change opening hours"
                                            icon={Calendar}
                                            iconAfter={ChevronRight}
                                        />
                                    </Group.Item>
                                    <Group.Item>
                                        <StyledListItem
                                            title="Enable/Disable price calculation"
                                            icon={DollarSign}
                                            iconAfter={ChevronRight}
                                        />
                                    </Group.Item>
                                    <Group.Item>
                                        <StyledListItem
                                            title="Manage users"
                                            icon={BookUser}
                                            iconAfter={ChevronRight}
                                        />
                                    </Group.Item>
                                </>
                                }
                                {!user.is_admin &&
                                    <Group.Item>
                                        <StyledListItem
                                            title="Leave store"
                                            icon={LogOut}
                                            iconAfter={ChevronRight}
                                        />
                                    </Group.Item>
                                }
                            </Group>
                        </> : <>
                            <SizableText>Join or create Store</SizableText>
                            <Group orientation="vertical"
                                   boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                                   separator={<Separator />}
                            >
                                <Group.Item>
                                    <StyledListItem
                                        title="Join store"
                                        icon={TextSearch}
                                        iconAfter={ChevronRight}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Create store"
                                        icon={TextSearch}
                                        iconAfter={ChevronRight}
                                    />
                                </Group.Item>
                            </Group>
                        </>}
                        <BigButton alignSelf="center" onClick={() => handleLogout()}>Log out</BigButton>
                    </VerticalContainer>
                    <VerticalContainer flex={6}>
                        {currentPage === 'profileDetails' ? <ProfileDetails user={user} store={store} /> :
                        currentPage === 'changeName' ? <ChangeName user={user} /> :
                        currentPage === 'changePassword' ? <ChangePassword user={user} /> :
                            currentPage === 'storeDetails' ? <StoreDetails store={store} /> : <></>}
                    </VerticalContainer>
                </HorizontalContainer>
                        {/*<VerticalContainer>*/}
                        {/*    <H3>User info</H3>*/}
                        {/*    <SizableText>Name: {user.name}</SizableText>*/}
                        {/*    <SizableText>Email: {user.email}</SizableText>*/}
                        {/*    <BigButton icon={UserPen} onClick={() => navigate('/edit/profile')}>Edit profile</BigButton>*/}
                        {/*    <SmallButtonWithAccent icon={LogOut} onClick={() => handleLogout()}>Logout</SmallButtonWithAccent>*/}
                        {/*</VerticalContainer>*/}
                        {/*{store ?*/}
                        {/*    <VerticalContainer>*/}
                        {/*        <H3>Store info</H3>*/}
                        {/*        <SizableText>Store name: {store.name}</SizableText>*/}
                        {/*        <HorizontalContainer>*/}
                        {/*            <SizableText>{profitError ? profitError : "Today's profit: " + profit}</SizableText>*/}
                        {/*            <SmallButton iconAfter={*/}
                        {/*                <Square animation='slow' rotate={isProfitLoading ? '360deg' : '0deg'}>*/}
                        {/*                    <RefreshCw size="$1" />*/}
                        {/*                </Square>*/}
                        {/*            } onClick={() => {getTodayProfit()}} >Refresh</SmallButton>*/}
                        {/*        </HorizontalContainer>*/}
                        {/*        <Accordion overflow="hidden" type="single" collapsible>*/}
                        {/*            <Accordion.Item value="store">*/}
                        {/*                <Accordion.Header>*/}
                        {/*                    <Accordion.Trigger flexDirection="row" justifyContent="space-between">*/}
                        {/*                        {({open}) => (*/}
                        {/*                            <>*/}
                        {/*                                <Paragraph>{open ? 'Hide' : 'Show'} Store ID</Paragraph>*/}
                        {/*                                <Square animation="quick" rotate={open ? '180deg' : '0deg'}>*/}
                        {/*                                </Square>*/}
                        {/*                            </>*/}
                        {/*                        )}*/}
                        {/*                    </Accordion.Trigger>*/}
                        {/*                </Accordion.Header>*/}
                        {/*                <Accordion.HeightAnimator animation="medium">*/}
                        {/*                    <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>*/}
                        {/*                    </Accordion.Content>*/}
                        {/*                </Accordion.HeightAnimator>*/}
                        {/*                <Accordion.Content />*/}
                        {/*            </Accordion.Item>*/}
                        {/*        </Accordion>*/}
                        {/*        {user.is_admin && <BigButton icon={PenSquare} onClick={() => navigate('/edit/store')}>Edit store</BigButton>}*/}
                        {/*    </VerticalContainer> : <>*/}
                        {/*    <SmallButton onClick={() => navigate('/new/store', {replace: true})}>Join or Create a Store</SmallButton>*/}
                        {/*</>}*/}
                {/*<HorizontalContainer>*/}
                {/*    {store && user.is_admin ? <>*/}
                {/*        <StoreUsers />*/}
                {/*    </> : <></>}*/}
                {/*</HorizontalContainer>*/}
            </> : <>
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </>}
        </VerticalContainer>
    )
}

export default Profile;