import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {Formik} from "formik";
import {Button, Form, Row} from "react-bootstrap";
import SelectOpeningHours from "./SelectOpeningHours.jsx";

const CreateStore = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.post('/api/store', {
                name: values.name,
                opening_hours: values.opening_hours,
                calculation_enabled: values.calculation_enabled,
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 201) {
                navigate('/sell', {replace: true});
            }
        } catch (error) {
            console.error(error);
        }
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
                    </Form>
                )}
            </Formik>
        </Row>
    )
}

export default CreateStore;