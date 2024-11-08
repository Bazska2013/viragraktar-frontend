import {Button} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {logout} from "../features/auth/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../features/auth/userSlice.js";

const Profile = () => {
    const user = useSelector(selectCurrentUser);


    return (
        <div>
            <h1>Profile</h1>
            {user ? <>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
            </> : <>
                <p>Loading...</p>
            </>}
        </div>
    )
}

export default Profile;