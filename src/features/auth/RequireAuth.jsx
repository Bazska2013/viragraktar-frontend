import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {selectAuth} from "./authSlice.js";

export const RequireAuth = ({children}) => {
    let authenticated = useSelector(selectAuth);
    console.log(authenticated);

    // if (!authenticated) {
    //     return <Navigate to="/login" replace/>;
    // }

    return children;
}