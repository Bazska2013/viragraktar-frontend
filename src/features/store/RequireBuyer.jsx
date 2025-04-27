import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/userSlice.js";
import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";

export const RequireBuyer = ({children}) => {
    const user = useSelector(selectCurrentUser);

    if (user && user.is_buyer) {
        return children;
    }

    return <Navigate to={'/profile'} replace />;
}

RequireBuyer.propTypes = {
    children: PropTypes.node.isRequired,
}