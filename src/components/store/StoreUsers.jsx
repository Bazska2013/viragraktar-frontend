import {Container, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import StoreUsersRow from "./StoreUsersRow.jsx";
import {Accordion, H2, H4, Square} from "tamagui";
import {VerticalContainer} from "../../tamagui.config.ts";
import {ChevronDown} from "@tamagui/lucide-icons";

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
        <VerticalContainer>
            <H2>Manage users</H2>
            <Accordion overflow="hidden" type="multiple"
                       boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                       borderRadius="$5"
            >
                {Object.keys(users).map((user, index) => (
                    <Accordion.Item value={user} key={index}>
                        <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                            {({open}) => (
                                <>
                                    <H4>{users[user].name}</H4>
                                    <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                        <ChevronDown size="$1" />
                                    </Square>
                                </>

                            )}
                        </Accordion.Trigger>
                        <Accordion.HeightAnimator animation="medium">
                            <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
                                <StoreUsersRow
                                    name={users[user].name}
                                    email={users[user].email}
                                    isSeller={users[user].is_seller}
                                    isBuyer={users[user].is_buyer}
                                    isAdmin={users[user].is_admin}
                                    id={users[user].id}
                                    refetchUsers={fetchUsers}
                                />
                            </Accordion.Content>
                        </Accordion.HeightAnimator>
                    </Accordion.Item>
                ))}
            </Accordion>
        </VerticalContainer>
    )
}

export default StoreUsers;