import {Container, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "../axiosConfig.js";
import StoreUsersRow from "./StoreUsersRow.jsx";

const StoreUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/store/users', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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