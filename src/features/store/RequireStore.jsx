import {useEffect, useState} from "react";
import {createStore, selectStore} from "./storeSlice.js";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../axiosConfig.js";
import {Navigate} from "react-router-dom";
import {Spinner} from "react-bootstrap";
import PropTypes from "prop-types";

export const RequireStore = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasStore, setHasStore] = useState(false);
    const store = useSelector(selectStore);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkStore = async () => {
            if (store) {
                setHasStore(true);
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get('/api/store');
                if (response.status === 200 && Object.keys(response.data).length > 0) {
                    setHasStore(true);
                    dispatch(createStore(response.data));
                }
            } catch (error) {
                setError(error.response.data.message);
                setHasStore(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkStore();
    }, [dispatch, store]);

    if (isLoading) {
        return <Spinner color="#292023" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return hasStore ? children : <Navigate to={'/profile'} replace />
}

RequireStore.propTypes = {
    children: PropTypes.node.isRequired,
}