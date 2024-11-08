import {Container, Nav, Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectCurrentUser} from "../features/auth/userSlice.js";
import axios from "../axiosConfig.js";
import {logout} from "../features/auth/authSlice.js";

const NavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        <>
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/', {replace: true})}>Home</Navbar.Brand>
                    <Nav>
                        {user ? <>
                            <Nav.Link onClick={() => navigate('/profile')} >Profile</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
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