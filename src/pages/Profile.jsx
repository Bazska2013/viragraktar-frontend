import {Button} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {logout} from "../features/auth/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../features/auth/userSlice.js";
import {useState} from "react";

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const [store, setStore] = useState(null);
    const [openingHours, setOpeningHours] = useState(null);

    const handleStore = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const response = await axios.get('/api/store', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                setStore(response.data);
                setOpeningHours(JSON.parse(response.data.opening_hours));
            }
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
            <Button onClick={handleStore}>View Store</Button>
            {store ? <>
                <p>Store name: {store.name}</p>
                <p>Opening hours:</p>
                <ul>
                    {Object.keys(openingHours).map((day, index) => (
                        <li key={index}>{day}: {openingHours[day].from} - {openingHours[day].to}</li>
                    ))}
                </ul>
                <p>Calculation enabled: {store.calculation_enabled}</p>
            </> : <></>}
        </div>
    )
}

export default Profile;