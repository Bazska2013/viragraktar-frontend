import {Col, Container} from 'react-bootstrap';
import {selectCurrentUser} from "../../features/auth/userSlice.js";
import {useSelector} from "react-redux";
import ChangeName from "../../components/profile/ChangeName.jsx";
import ChangePassword from "../../components/profile/ChangePassword.jsx";
import {XStack} from "tamagui";
import {EditContainer, HorizontalContainer} from "../../tamagui.config.ts";

const EditProfile = () => {
    const user = useSelector(selectCurrentUser);

    return (
        <EditContainer>
            <HorizontalContainer>
                <ChangeName user={user}/>
                <ChangePassword user={user}/>
            </HorizontalContainer>
        </EditContainer>
    )
}

export default EditProfile;