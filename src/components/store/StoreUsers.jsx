import {Container, Spinner, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import StoreUsersRow from "./StoreUsersRow.jsx";

const StoreUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
        <Container>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Seller</th>
                        <th>Buyer</th>
                        <th>Admin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <StoreUsersRow key={user.id} user={user} refetchUsers={fetchUsers} />
                ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default StoreUsers;