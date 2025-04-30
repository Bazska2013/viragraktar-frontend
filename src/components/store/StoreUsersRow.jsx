import React, {useState} from "react";
import axios from "../../axiosConfig.js";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, setUser} from "../../features/auth/userSlice.js";
import {SizableText, Spinner, Separator, Label, Switch, H6, AlertDialog, YStack, XStack} from "tamagui";
import {Save, Trash} from "lucide-react";
import {BigButton, HorizontalContainer, SmallButton, SmallButtonWithAccent, StyledGroup, VerticalContainer} from "../../tamagui.config.ts";
import PropTypes from "prop-types";

const StoreUsersRow = ({isSeller, isBuyer, isAdmin, user, id, refetchUsers, name, email}) => {
    const [isSellerR, setIsSellerR] = useState(!!isSeller);
    const [isBuyerR, setIsBuyerR] = useState(!!isBuyer);
    const [isAdminR, setIsAdminR] = useState(!!isAdmin);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    const [isChanged, setIsChanged] = useState(false);

    const handleChange = (checked, type) => {
        setIsChanged(true);
        switch (type) {
            case 'seller':
                setIsSellerR(checked);
                break;
            case 'buyer':
                setIsBuyerR(checked);
                break;
            case 'admin':
                if (currentUser.id === user.id) {
                    return;
                }
                setIsAdminR(checked);
                break;
        }
    }

    const handleSave = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/update-privileges/' + id, {
                is_seller: isSellerR,
                is_buyer: isBuyerR,
                is_admin: isAdminR
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response?.data?.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 204) {
                setIsChanged(false);
                await updateUser()
            }
        }
    }

    const updateUser = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/user');
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                dispatch(setUser(response.data));
            }
        }
    }

    const handleDelete = async () => {
        if (currentUser.id === id) {
            return
        }
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/store/users/remove/' + id);
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 204) {
                refetchUsers();
            }
        }
    }

    if (isLoading) {
        return (
            <Spinner color="#292023" size="large">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    if (error) {
        return (
            <SizableText color="red">{error}</SizableText>
        )
    }
    return (
        <VerticalContainer>
            <HorizontalContainer flex={1} alignItems="center">
                <H6 flex={1}>Name</H6>
                <SizableText flex={2}>{name}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center">
                <H6 flex={1}>Email</H6>
                <SizableText flex={2}>{email}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={name + 'seller'}>
                    <H6>Seller</H6>
                </Label>
                <Switch checked={isSellerR} id={name + 'seller'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'seller')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={name + 'buyer'}>
                    <H6>Buyer</H6>
                </Label>
                <Switch checked={isBuyerR} id={name + 'buyer'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'buyer')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={name + 'admin'}>
                    <H6>Admin</H6>
                </Label>
                <Switch checked={isAdminR} disabled={currentUser.id === user?.id} opacity={currentUser.id !== id ? "1" : "0.5"} id={name + 'admin'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'admin')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <StyledGroup orientation="horizontal" justifyContent="space-between" alignSelf="center">
                <SmallButtonWithAccent boxShadow="unset" icon={Save} disabled={!isChanged} opacity={isChanged ? 1 : 0.5} onClick={handleSave}>Save changes</SmallButtonWithAccent>
                <AlertDialog native>
                    <AlertDialog.Trigger asChild>
                        <SmallButtonWithAccent boxShadow="unset" icon={Trash} disabled={currentUser.id === id} opacity={currentUser.id !== id ? 1 : 0.5}>Remove user</SmallButtonWithAccent>
                    </AlertDialog.Trigger>

                    <AlertDialog.Portal>
                        <AlertDialog.Overlay
                            key="overlay"
                            animation="quick"
                            opacity={0.5}
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                        <AlertDialog.Content
                            bordered
                            elevate
                            key="content"
                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                            x={0}
                            scale={1}
                            opacity={1}
                            y={0}
                        >
                            <YStack gap="$4">
                                <AlertDialog.Title>Action required</AlertDialog.Title>
                                <AlertDialog.Description>
                                    Are you sure you want to remove this user from the store?
                                </AlertDialog.Description>

                                <XStack gap="$3" justifyContent="flex-end">
                                    <AlertDialog.Cancel asChild>
                                        <SmallButton>Cancel</SmallButton>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action asChild>
                                        <BigButton size="$3" theme="accent" onClick={handleDelete}>Confirm</BigButton>
                                    </AlertDialog.Action>
                                </XStack>
                            </YStack>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog>
            </StyledGroup>
        </VerticalContainer>
    )
}

StoreUsersRow.propTypes = {
    isSeller: PropTypes.number,
    isBuyer: PropTypes.number,
    isAdmin: PropTypes.number,
    user: PropTypes.object,
    id: PropTypes.number,
    refetchUsers: PropTypes.func,
    name: PropTypes.string,
    email: PropTypes.string
}

export default React.memo(StoreUsersRow);