import {Button, Form, Row, Spinner} from "react-bootstrap";
import {Formik} from "formik";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import SelectOpeningHours from "../../components/store/SelectOpeningHours.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createStore, selectStore} from "../../features/store/storeSlice.js";

const UpdateStore = () => {
    const store = useSelector(selectStore);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/store', {
                name: values.name,
                opening_hours: values.opening_hours,
                calculation_enabled: values.calculation_enabled,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                dispatch(createStore(response.data));
                navigate('/profile', {replace: true});
            }
        }
    }

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <Row>
            <Formik
                initialValues={{
                    name: store ? store.name : '',
                    opening_hours: store ? store.opening_hours : '',
                    calculation_enabled: store ? store.calculation_enabled : false,
                }}
                onSubmit={(values) => {
                    handleSubmit(values)
                }}
            >
                {({handleSubmit, handleChange, values, errors, setFieldValue}) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label column="lg">
                                Name of your store
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <SelectOpeningHours name="opening_hours" setFieldValue={setFieldValue} defaultValue={store.opening_hours} />
                        <Form.Group controlId="calculation_enabled">
                            <Form.Check
                                type="checkbox"
                                name="calculation_enabled"
                                label="Enable price calculation"
                                checked={values.calculation_enabled}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button type="submit">
                            Update store
                        </Button>
                        {error ? <>{error}</> : <></>}
                    </Form>
                )}

            </Formik>
        </Row>
    )
}

export default UpdateStore;