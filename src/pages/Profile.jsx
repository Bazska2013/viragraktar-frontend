import {Button, Col, Container, Row} from "react-bootstrap";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../features/auth/userSlice.js";
import {useEffect, useState} from "react";
import {selectStore} from "../features/store/storeSlice.js";
import StoreUsers from "../components/store/StoreUsers.jsx";

const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);
    const [storeId, setStoreId] = useState(null);
    const [profit, setProfit] = useState(0);

    const getTodayProfit = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.get('/api/store/profit/today', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                setProfit(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

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

    useEffect(() => {
        if (store) {
            getTodayProfit();
        }
    }, []);

    return (
        <div>
            <h1>Profile</h1>
            {user ? <>
                <Container>
                    <Row>
                        <Col>
                            <Row><h2>User info</h2></Row>
                            <Row>Name: {user.name}</Row>
                            <Row>Email: {user.email}</Row>
                            <Row><Button>Edit profile</Button></Row>
                        </Col>
                        {store ? <>
                            <Col>
                                <Row><h2>Store info</h2></Row>
                                <Row>Store name: {store.name}</Row>
                                <Row>
                                    <Col>Today's profit: {profit}</Col>
                                    <Col><Button onClick={() => {getTodayProfit()}}>Refresh</Button></Col>
                                </Row>
                                <Row>
                                    {storeId ? <>
                                        <Col>
                                            <Button onClick={() => {
                                                setStoreId(null)
                                            }}>
                                                Hide Store ID
                                            </Button>
                                        </Col>
                                        <Col>
                                            Store ID: {storeId}
                                        </Col>
                                    </> : <>
                                        <Button onClick={() => {handleShowStoreId()}}>
                                            Show Store ID
                                        </Button>
                                    </>}
                                </Row>
                                <Row><Button onClick={() => navigate('/edit/store')}>Edit store</Button></Row>
                            </Col>
                        </> : <>
                            <Button onClick={() => navigate('/new/store', {replace: true})}>Join or Create a Store</Button>
                        </>}
                    </Row>
                    <Row>
                        {store && user.is_admin ? <>
                            <StoreUsers />
                        </> : <></>}
                    </Row>
                </Container>
            </> : <>
                <p>Loading...</p>
            </>}
        </div>
    )
}

export default Profile;