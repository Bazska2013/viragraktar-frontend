import {Container, Nav, Navbar, Spinner} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../features/auth/userSlice.js";
import axios from "../axiosConfig.js";
import {logout} from "../features/auth/authSlice.js";
import {deleteStore, selectStore} from "../features/store/storeSlice.js";
import {useState} from "react";

const NavBar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout').then(() => {
                setIsLoading(true);
            })
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(logout());
            dispatch(removeUser());
            dispatch(deleteStore());
            setIsLoading(false);
            navigate('/login', {replace: true});
        }
    }

    return (
        <>
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/', {replace: true})}>Home</Navbar.Brand>
                    <Nav>
                        {user ? <>
                            {store ? <>
                                {(user.is_seller && user.is_buyer) ? <>
                                    <Nav.Link onClick={() => navigate('/sell')} >Sell</Nav.Link>
                                    <Nav.Link onClick={() => navigate('/buy')} >Buy</Nav.Link>
                                </> : user.is_seller ? <>
                                    <Nav.Link onClick={() => navigate('/sell')} >Sell</Nav.Link>
                                </> : user.is_buyer ? <>
                                    <Nav.Link onClick={() => navigate('/buy')} >Buy</Nav.Link>
                                </> : <></>}
                            </> : <></>}
                            <Nav.Link onClick={() => navigate('/profile')} >Profile</Nav.Link>
                            {isLoading ? <>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </> : <Nav.Link onClick={handleLogout}>Log out</Nav.Link>}
                        </> : <>
                            <Nav.Link onClick={() => navigate('/login')} >Log in</Nav.Link>
                            <Nav.Link onClick={() => navigate('/register')} >Register</Nav.Link>
                        </>}
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar;