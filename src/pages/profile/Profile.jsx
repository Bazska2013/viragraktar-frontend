import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../../features/auth/userSlice.js";
import {useEffect, useState} from "react";
import {deleteStore, selectStore} from "../../features/store/storeSlice.js";
import StoreUsers from "../../components/store/StoreUsers.jsx";
import {Spinner, SizableText, Separator, Group, H6, H4, H2} from "tamagui";
import {
    BookKey,
    BookUser,
    ChevronRight,
    FilePen,
    LineChart,
    LogOut,
    Tags,
    TextSearch,
    UserPen,
    UserSearch
} from "@tamagui/lucide-icons";
import {VerticalContainer, HorizontalContainer, BigButton, StyledListItem, StyledGroup} from "../../tamagui.config.ts";
import {logout} from "../../features/auth/authSlice.js";
import ProfileDetails from "../../components/profile/ProfileDetails.jsx";
import ChangeName from "../../components/profile/ChangeName.jsx";
import ChangePassword from "../../components/profile/ChangePassword.jsx";
import StoreDetails from "../../components/store/StoreDetails.jsx";
import JoinStore from "../../components/store/JoinStore.jsx";
import UpdateStore from "../../components/store/UpdateStore.jsx";
import CreateStore from "../../components/store/CreateStore.jsx";
import ViewReport from "../../components/store/ViewReport.jsx";
import ModifyLabels from "../../components/store/ModifyLabels.jsx";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);
    const [profit, setProfit] = useState(0);
    const [isProfitLoading, setIsProfitLoading] = useState(false);
    const [profitError, setProfitError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState('profileDetails');

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

    useEffect(() => {
        if (store) {
            getTodayProfit();
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getTodayProfit();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <VerticalContainer>
            {!isLoading ? <>
                <HorizontalContainer width="95%" alignSelf="center">
                    <VerticalContainer height="max-content" width={screenSize > 1280 ? "30%" : (screenSize > 768 ? "40%" : "100%")}>
                        <H2 width="100%" alignSelf="center">Profile</H2>
                        <VerticalContainer
                            borderRadius="$5"
                            width="100%"
                            alignSelf="center"
                            boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                            padding="$3"
                            height="max-content"
                        >
                            <H4>Hello {user?.name}!</H4>
                            {store &&
                                profitError ? <H6>An error occured when trying to load today's profit: {profitError}</H6> :
                                    <H6>Today's profit of {store?.name} is HUF {isProfitLoading ? <Spinner /> : profit}</H6>
                            }
                        </VerticalContainer>
                        <SizableText>User settings</SizableText>
                        <StyledGroup orientation="vertical"
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
                                    title="Change name"
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
                        </StyledGroup>
                        {store && user.is_admin ? <>
                            <SizableText>Store settings</SizableText>
                            <StyledGroup orientation="vertical"
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
                                <Group.Item>
                                    <StyledListItem
                                        title="View report"
                                        icon={LineChart}
                                        iconAfter={ChevronRight}
                                        onClick={() => {setCurrentPage('viewReport')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Update store details"
                                        icon={FilePen}
                                        iconAfter={ChevronRight}
                                        onClick={() => {setCurrentPage('updateStore')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Manage users"
                                        icon={BookUser}
                                        iconAfter={ChevronRight}
                                        onClick={() => {setCurrentPage('manageUsers')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Modify labels"
                                        icon={Tags}
                                        iconAfter={ChevronRight}
                                        onClick={() => {setCurrentPage('modifyLabels')}}
                                    />
                                </Group.Item>
                            </StyledGroup>
                        </> : store ? <>
                            <SizableText>Store settings</SizableText>
                            <StyledGroup orientation="vertical"
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
                                <Group.Item>
                                    <StyledListItem
                                        title="Leave store"
                                        icon={LogOut}
                                        iconAfter={ChevronRight}
                                    />
                                </Group.Item>
                            </StyledGroup>
                        </> : <>
                            <SizableText>Join or create Store</SizableText>
                            <StyledGroup orientation="vertical"
                                   separator={<Separator />}
                            >
                                <Group.Item>
                                    <StyledListItem
                                        title="Join store"
                                        icon={TextSearch}
                                        iconAfter={ChevronRight}
                                        onClick={() => {setCurrentPage('joinStore')}}
                                    />
                                </Group.Item>
                                <Group.Item>
                                    <StyledListItem
                                        title="Create store"
                                        icon={TextSearch}
                                        iconAfter={ChevronRight}
                                        onClick={() => {setCurrentPage('createStore')}}
                                    />
                                </Group.Item>
                            </StyledGroup>
                        </>}
                        <BigButton alignSelf="center" onClick={() => handleLogout()}>Log out</BigButton>
                        {screenSize < 768 && <>
                            <Separator />
                            <VerticalContainer width="100%"
                                               marginBottom="5rem"
                                               height="max-content"
                            >
                                {currentPage === 'profileDetails' ? <ProfileDetails user={user} store={store} /> :
                                    currentPage === 'changeName' ? <ChangeName user={user} /> :
                                        currentPage === 'changePassword' ? <ChangePassword user={user} /> :
                                            currentPage === 'storeDetails' ? <StoreDetails store={store} /> :
                                                currentPage === 'joinStore' ? <JoinStore /> :
                                                    currentPage === 'updateStore' ? <UpdateStore /> :
                                                        currentPage === 'manageUsers' ? <StoreUsers /> :
                                                            currentPage === 'createStore' ? <CreateStore /> :
                                                                currentPage === 'viewReport' ? <ViewReport /> :
                                                                    currentPage === 'modifyLabels' ? <ModifyLabels /> : <></>}
                            </VerticalContainer>
                        </>}
                    </VerticalContainer>
                    {screenSize > 768 && <>
                        <VerticalContainer width={screenSize > 1280 ? "70%" : '60%'}
                                           marginBottom="5rem"
                                           height="max-content"
                        >
                            {currentPage === 'profileDetails' ? <ProfileDetails user={user} store={store} /> :
                                currentPage === 'changeName' ? <ChangeName user={user} /> :
                                    currentPage === 'changePassword' ? <ChangePassword user={user} /> :
                                        currentPage === 'storeDetails' ? <StoreDetails store={store} /> :
                                            currentPage === 'joinStore' ? <JoinStore /> :
                                                currentPage === 'updateStore' ? <UpdateStore /> :
                                                    currentPage === 'manageUsers' ? <StoreUsers /> :
                                                        currentPage === 'createStore' ? <CreateStore /> :
                                                            currentPage === 'viewReport' ? <ViewReport /> :
                                                                currentPage === 'modifyLabels' ? <ModifyLabels /> : <></>}
                        </VerticalContainer>
                    </>}
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