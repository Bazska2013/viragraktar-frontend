import {Button} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {logout} from "../features/auth/authSlice.js";
import {useDispatch} from "react-redux";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            <p>Name: </p>
            <p>Email: </p>
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </div>
    )
}

export default Profile;