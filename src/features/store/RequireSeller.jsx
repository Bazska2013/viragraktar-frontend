import {selectCurrentUser} from "../auth/userSlice.js";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

export const RequireSeller = ({children}) => {
    const user = useSelector(selectCurrentUser);

    if (user && user.is_seller) {
        return children;
    }

    return <Navigate to={'/profile'} replace />;
}