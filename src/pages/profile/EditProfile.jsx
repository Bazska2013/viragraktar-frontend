import {Col, Container} from 'react-bootstrap';
import {selectCurrentUser} from "../../features/auth/userSlice.js";
import {useSelector} from "react-redux";
import ChangeName from "../../components/profile/ChangeName.jsx";
import ChangePassword from "../../components/profile/ChangePassword.jsx";
import {XStack} from "tamagui";

const EditProfile = () => {
    const user = useSelector(selectCurrentUser);

    return (
        <XStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$2"
            padding="$2"
            justifyContent="space-between"
        >
                <ChangeName user={user}/>
                <ChangePassword user={user}/>
        </XStack>
    )
}

export default EditProfile;