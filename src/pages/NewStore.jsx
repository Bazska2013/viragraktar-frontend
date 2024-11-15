import {Button, Container, Row} from "react-bootstrap";
import {useState} from "react";
import JoinStore from "../components/JoinStore.jsx";
import CreateStore from "../components/CreateStore.jsx";

const NewStore = () => {
    const [joinStore, setJoinStore] = useState(true);

    return (
        <>
            {joinStore ? <>
                <Container>
                    <JoinStore />
                    <Row>
                        <Button onClick={() => setJoinStore(false)}>Create Store</Button>
                    </Row>
                </Container>
            </> : <>
                <Container>
                    <Row>
                        <Button onClick={() => setJoinStore(true)}>Join Store</Button>
                    </Row>
                    <CreateStore />
                </Container>
            </>}
        </>
    );
}

export default NewStore;