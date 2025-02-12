import {useState} from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import axios from "../../axiosConfig.js";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, setUser} from "../../features/auth/userSlice.js";

const StoreUsersRow = ({ user, refetchUsers }) => {
    const [isSeller, setIsSeller] = useState(user.is_seller);
    const [isBuyer, setIsBuyer] = useState(user.is_buyer);
    const [isAdmin, setIsAdmin] = useState(user.is_admin);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    const [isChanged, setIsChanged] = useState(false);

    const handleChange = (e) => {
        setIsChanged(true);
        switch (e.target.name) {
            case 'seller':
                setIsSeller(e.target.checked);
                break;
            case 'buyer':
                setIsBuyer(e.target.checked);
                break;
            case 'admin':
                if (currentUser.id === user.id) {
                    return;
                }
                setIsAdmin(e.target.checked);
                break;
        }
    }

    const handleSave = async () => {
        let response;
        setIsLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            response = await axios.post('/update-privileges/' + user.id, {
                is_seller: isSeller,
                is_buyer: isBuyer,
                is_admin: isAdmin
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
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
            await axios.get('/sanctum/csrf-cookie', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            response = await axios.get('/api/user', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
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
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            response = await axios.post('/api/store/users/remove/' + user.id, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
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
            <tr>
                <td colSpan={6}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </td>
            </tr>
        )
    }

    if (error) {
        return (
            <tr>
                <td colSpan={6}>
                    <p>{error}</p>
                </td>
            </tr>
        )
    }

    return (
        <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
                <Form.Check name='seller' checked={isSeller}
                            onChange={(e) => handleChange(e)}
                />
            </td>
            <td>
                <Form.Check name='buyer' checked={isBuyer}
                            onChange={(e) => handleChange(e)}
                />
            </td>
            <td>
                <Form.Check name='admin' checked={isAdmin} disabled={currentUser.id === user.id}
                            onChange={(e) => handleChange(e)}
                />
            </td>
            <td>
                {isChanged ? <Button onClick={() => handleSave()}>Save</Button> : <></>}
                {currentUser.id === user.id ? <></> : <Button onClick={() => handleDelete()}>Delete</Button>}
            </td>
        </tr>
    )
}

export default StoreUsersRow;