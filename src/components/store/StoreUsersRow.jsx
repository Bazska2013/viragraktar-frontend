import {useState} from "react";
import axios from "../../axiosConfig.js";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, setUser} from "../../features/auth/userSlice.js";
import {Group, SizableText, Spinner, Separator, Label, Switch, H6} from "tamagui";
import {Save, Trash} from "@tamagui/lucide-icons";
import {HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";

const StoreUsersRow = (props) => {
    const [isSeller, setIsSeller] = useState(!!props.isSeller);
    const [isBuyer, setIsBuyer] = useState(!!props.isBuyer);
    const [isAdmin, setIsAdmin] = useState(!!props.isAdmin);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    const [isChanged, setIsChanged] = useState(false);

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
                if (currentUser.id === props.user.id) {
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
            response = await axios.post('/api/update-privileges/' + props.id, {
                is_seller: isSeller,
                is_buyer: isBuyer,
                is_admin: isAdmin
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response?.data?.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
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
            response = await axios.post('/api/store/users/remove/' + props.id);
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 204) {
                props.refetchUsers();
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
        <VerticalContainer>
            <HorizontalContainer flex={1} alignItems="center">
                <H6 flex={1}>Name</H6>
                <SizableText flex={2}>{props.name}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center">
                <H6 flex={1}>Email</H6>
                <SizableText flex={2}>{props.email}</SizableText>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={props.name + 'seller'}>
                    <H6>Seller</H6>
                </Label>
                <Switch checked={isSeller} id={props.name + 'seller'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'seller')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={props.name + 'buyer'}>
                    <H6>Buyer</H6>
                </Label>
                <Switch checked={isBuyer} id={props.name + 'buyer'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'buyer')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <HorizontalContainer flex={1} alignItems="center" justifyContent="space-between">
                <Label htmlFor={props.name + 'admin'}>
                    <H6>Admin</H6>
                </Label>
                <Switch checked={isAdmin} disabled={currentUser.id === props.id} opacity={currentUser.id !== props.id ? "1" : "0.5"} id={props.name + 'admin'} size="$3" onCheckedChange={(checked) => handleChange(checked, 'admin')}>
                    <Switch.Thumb animation="bouncy" />
                </Switch>
            </HorizontalContainer>
            <Separator />
            <Group orientation="horizontal" justifyContent="space-between" alignSelf="center">
                <SmallButtonWithAccent icon={Save} disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onClick={() => handleSave()} >Save changes</SmallButtonWithAccent>
                <SmallButtonWithAccent icon={Trash} disabled={currentUser.id === props.id} opacity={currentUser.id !== props.id ? "1" : "0.5"} onClick={() => handleDelete()} >Remove user</SmallButtonWithAccent>
            </Group>
        </VerticalContainer>
    )
}

export default StoreUsersRow;