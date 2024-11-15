import {Button} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {logout} from "../features/auth/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../features/auth/userSlice.js";
import {useState} from "react";
import {selectStore} from "../features/store/storeSlice.js";

const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);

    return (
        <div>
            <h1>Profile</h1>
            {user ? <>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                {store ? <>
                    <p>Store name: {store.name}</p>
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