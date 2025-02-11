import {Col, Container} from 'react-bootstrap';
import {selectCurrentUser} from "../../features/auth/userSlice.js";
import {useSelector} from "react-redux";
import ChangeName from "../../components/profile/ChangeName.jsx";
import ChangePassword from "../../components/profile/ChangePassword.jsx";

const EditProfile = () => {
    const user = useSelector(selectCurrentUser);

    return (
        <Container>
            <Col>
                <ChangeName user={user}/>
            </Col>
            <Col>
                <ChangePassword user={user}/>
            </Col>
        </Container>
    )
}

export default EditProfile;