import {Button, Card, Col, Collapse, Container, Fade, Row, Spinner} from "react-bootstrap";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../features/auth/userSlice.js";
import {useEffect, useState} from "react";
import {selectStore} from "../../features/store/storeSlice.js";
import StoreUsers from "../../components/store/StoreUsers.jsx";

const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const store = useSelector(selectStore);
    const [storeId, setStoreId] = useState(null);
    const [storeIdVisible, setStoreIdVisible] = useState(false);
    const [profit, setProfit] = useState(0);
    const [isProfitLoading, setIsProfitLoading] = useState(false);
    const [profitError, setProfitError] = useState(null);
    const [isStoreIdLoading, setIsStoreIdLoading] = useState(false);
    const [storeIdError, setStoreIdError] = useState(null);

    const getTodayProfit = async () => {
        let response;
        setIsProfitLoading(true);
        try {
            response = await axios.get('/api/store/profit/today');
        } catch (error) {
            setIsProfitLoading(false);
            setProfitError(error.response.data.message);
        } finally {
            setIsProfitLoading(false);
            if (response?.status === 200) {
                setProfit(response.data);
            }
        }
    }

    const handleShowStoreId = async () => {
        let response;
        setIsStoreIdLoading(true);
        try {
            response = await axios.get('/api/store/id');
        } catch (error) {
            setIsStoreIdLoading(false);
            setStoreIdError(error.response.data.message);
        } finally {
            setIsStoreIdLoading(false);
            if (response?.status === 200) {
                setStoreId(response.data);
            }
        }
    }

    useEffect(() => {
        if (store) {
            getTodayProfit();
            handleShowStoreId();
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            handleShowStoreId();
        }, 30000); // 30000 milliseconds = 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
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
                            <Row>
                                <Button onClick={() => navigate('/edit/profile')}>Edit profile</Button>
                            </Row>
                        </Col>
                        {store ? <>
                            <Col>
                                <Row><h2>Store info</h2></Row>
                                <Row>Store name: {store.name}</Row>
                                <Row>
                                    <Col>Today's profit: {isProfitLoading ? <>
                                        <Spinner animation="border" role="status" size='sm'>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </> : <>
                                        {profitError ? <>
                                            <p>{profitError}</p>
                                        </> : <>
                                            {profit}
                                        </>}
                                    </>}</Col>
                                    <Col><Button onClick={() => {getTodayProfit()}}>Refresh</Button></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {isStoreIdLoading ? <>
                                            <Button disabled>
                                                <Spinner animation="border" role="status" size='sm'>
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            </Button>
                                        </> : <>
                                            {storeIdError ? <>
                                                <Button variant="secondary" onClick={() => {handleShowStoreId()}}>Retry</Button>
                                            </> : <>
                                                <Button onClick={() => {setStoreIdVisible(!storeIdVisible)}}>
                                                    {storeIdVisible ? 'Hide' : 'Show'} Store ID
                                                </Button>
                                            </>}
                                        </>}
                                    </Col>
                                    <Fade in={storeIdVisible} dimension={'width'}>
                                        <Col>
                                            <Card>
                                                <Card.Body>
                                                    {storeId}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Fade>
                                </Row>
                                {user.is_admin && <Row><Button onClick={() => navigate('/edit/store')}>Edit store</Button></Row>}
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
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </>}
        </div>
    )
}

export default Profile;