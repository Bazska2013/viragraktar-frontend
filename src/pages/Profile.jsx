import {Button} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {logout} from "../features/auth/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../features/auth/userSlice.js";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);

    const handleLogout = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }).then(async () => {
                await axios.post('/logout', {}, {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }).then(() => {
                    dispatch(logout());
                    dispatch(removeUser());
                    navigate('/login', {replace: true});
                })
            })
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            <h1>Profile</h1>
            {user ? <>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
            </> : <>
                <p>Loading...</p>
            </>}

            <Button onClick={handleLogout}>
                Log out
            </Button>
        </div>
    )
}

export default Profile;