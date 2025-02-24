import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {Formik} from "formik";
import {Button, Form, Row, Spinner} from "react-bootstrap";
import SelectOpeningHours from "./SelectOpeningHours.jsx";
import {useState} from "react";

const CreateStore = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/store', {
                name: values.name,
                opening_hours: values.opening_hours,
                calculation_enabled: values.calculation_enabled,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                navigate('/sell', {replace: true});
            }
        }
    }

    if (isLoading) {
        return (
            <Row>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Row>
        )
    }

    return (
        <Row>
            <Formik
                initialValues={{
                    name: '',
                    opening_hours: '',
                    calculation_enabled: false,
                }}
                onSubmit={(values) => {
                    handleSubmit(values)
                }}
            >
                {({ handleSubmit, handleChange, values, errors, setFieldValue }) => (
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
                        <SelectOpeningHours name="opening_hours" setFieldValue={setFieldValue} />
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
                            Create store
                        </Button>
                        {error && <Row>{error}</Row>}
                    </Form>
                )}
            </Formik>
        </Row>
    )
}

export default CreateStore;