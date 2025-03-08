import {Container, Spinner, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import StoreUsersRow from "./StoreUsersRow.jsx";
import {H4, H6, XStack, YStack} from "tamagui";
import {VerticalContainer, HorizontalContainer} from "../../tamagui.config.ts";

const StoreUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const screenSize = window.innerWidth;

    const fetchUsers = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/store/users');
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setUsers(response.data);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    if (error) {
        return (
            <Container>
                <h1>Error</h1>
                <p>{error}</p>
            </Container>
        )
    }

    return (
        <VerticalContainer>
            <HorizontalContainer>
                {screenSize > 768 ? <>
                    <H4>Name</H4>
                    <H4>Email</H4>
                    <H4>Seller</H4>
                    <H4>Buyer</H4>
                    <H4>Admin</H4>
                    <H4>Action</H4>
                </> : <>
                    <H6>Name</H6>
                    <H6>Email</H6>
                    <H6>Seller</H6>
                    <H6>Buyer</H6>
                    <H6>Admin</H6>
                    <H6>Action</H6></>}
            </HorizontalContainer>
            <VerticalContainer>
            {users.map((user) => (
                <StoreUsersRow key={user.id} user={user} refetchUsers={fetchUsers} />
            ))}
            </VerticalContainer>
        </VerticalContainer>
    )
}

export default StoreUsers;