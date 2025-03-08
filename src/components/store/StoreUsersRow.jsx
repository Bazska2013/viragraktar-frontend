import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, setUser} from "../../features/auth/userSlice.js";
import {Checkbox, Group, H4, H5, SizableText, XStack, Button, Spinner} from "tamagui";
import {Check, Save, Trash} from "@tamagui/lucide-icons";
import {HorizontalContainer, SmallButton, SmallButtonWithAccent} from "../../tamagui.config.ts";

const StoreUsersRow = ({ user, refetchUsers }) => {
    const [isSeller, setIsSeller] = useState(!!user.is_seller);
    const [isBuyer, setIsBuyer] = useState(!!user.is_buyer);
    const [isAdmin, setIsAdmin] = useState(!!user.is_admin);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    const [isChanged, setIsChanged] = useState(false);

    const screenSize = window.innerWidth;

    const handleChange = (checked, type) => {
        setIsChanged(true);
        switch (type) {
            case 'seller':
                setIsSeller(checked);
                break;
            case 'buyer':
                setIsBuyer(checked);
                break;
            case 'admin':
                if (currentUser.id === user.id) {
                    return;
                }
                setIsAdmin(checked);
                break;
        }
    }

    const handleSave = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/update-privileges/' + user.id, {
                is_seller: isSeller,
                is_buyer: isBuyer,
                is_admin: isAdmin
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
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/store/users/remove/' + user.id);
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
            <Spinner>
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
        <HorizontalContainer>
            {screenSize > 768 ? <>
                <H5>{user.name}</H5>
                <H5>{user.email}</H5>
            </> : <>
                <SizableText>{user.name}</SizableText>
                <SizableText>{user.email}</SizableText>
            </>}
            <Checkbox id={user.id} /*size="$3"*/ checked={isSeller} onCheckedChange={(checked) => handleChange(checked, 'seller')}>
                <Checkbox.Indicator>
                    <Check />
                </Checkbox.Indicator>
            </Checkbox>
            <Checkbox id={user.id} /*size="$3"*/ checked={isBuyer} onCheckedChange={(checked) => handleChange(checked, 'buyer')}>
                <Checkbox.Indicator>
                    <Check />
                </Checkbox.Indicator>
            </Checkbox>
            <Checkbox id={user.id} /*size="$3"*/ checked={isAdmin} disabled={currentUser.id === user.id} onCheckedChange={(checked) => handleChange(checked, 'admin')}>
                <Checkbox.Indicator>
                    <Check />
                </Checkbox.Indicator>
            </Checkbox>
            <Group orientation="horizontal">
                <SmallButtonWithAccent icon={Save}  disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onClick={() => handleSave()}>{screenSize > 768 ? 'Save cahnges' : ''}</SmallButtonWithAccent>
                <SmallButton icon={Trash} disabled={currentUser.id === user.id} opacity={currentUser.id !== user.id ? "1" : "0.5"} onClick={() => handleDelete()}>{screenSize > 768 ? 'Delete user' : ''}</SmallButton>
            </Group>
        </HorizontalContainer>
    )
}

export default StoreUsersRow;