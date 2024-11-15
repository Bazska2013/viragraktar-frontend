import {Button} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {logout} from "../features/auth/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../features/auth/userSlice.js";
import {useState} from "react";
import {selectStore} from "../features/store/storeSlice.js";
import StoreUsers from "../components/StoreUsers.jsx";

const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);
    const [storeId, setStoreId] = useState(null);

    const handleShowStoreId = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.get('/api/store/id', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                setStoreId(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Profile</h1>
            {user ? <>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                {store ? <>
                    <p>Store name: {store.name}</p>
                    {storeId ? <>
                        <Button onClick={() => {
                            setStoreId(null)
                        }}>
                            Hide Store ID
                        </Button>
                        <p>Store ID: {storeId}</p>
                    </> : <>
                        <Button onClick={() => {handleShowStoreId()}}>
                            Show Store ID
                        </Button>
                    </>}
                    {user.is_admin ? <>
                        <StoreUsers />
                    </> : <></>}
                </> : <>
                    <Button onClick={() => navigate('/new/store', {replace: true})}>Join or Create a Store</Button>
                </>}
            </> : <>
                <p>Loading...</p>
            </>}
        </div>
    )
}

export default Profile;