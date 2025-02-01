import {selectCurrentUser} from "../auth/userSlice.js";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

export const RequireAdmin = ({children}) => {
    const user = useSelector(selectCurrentUser);

    if (user && user.is_admin) {
        return children;
    }

    return <Navigate to={'/profile'} replace />;
}