import {useState} from "react";
import {Button, Form} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../features/auth/userSlice.js";
import {useNavigate} from "react-router-dom";

const StoreUsersRow = ({ user, refetchUsers }) => {
    const [isSeller, setIsSeller] = useState(user.is_seller);
    const [isBuyer, setIsBuyer] = useState(user.is_buyer);
    const [isAdmin, setIsAdmin] = useState(user.is_admin);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

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
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.post('/update-privileges/' + user.id, {
                is_seller: isSeller,
                is_buyer: isBuyer,
                is_admin: isAdmin
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 204) {
                setIsChanged(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.post('/api/store/users/remove/' + user.id, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 204) {
                refetchUsers();
            }
        } catch (error) {
            console.error(error);
        }
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