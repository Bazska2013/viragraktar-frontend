import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig.js';
import {Button, Form, Row, Spinner} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import {useState} from "react";

const JoinStore = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const schema = yup.object().shape({
        code: yup.string().min(6, "Code's length is incorrect").max(6, "Code's length is incorrect").required('Code is required'),
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            response = await axios.post('/api/join', {
                unique_id: values.code,
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                navigate('/sell', {replace: true});
            }
        }
    }

    return (
        <Row>
            {isLoading ? <>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        code: '',
                    }}
                    onSubmit={(values) => {handleSubmit(values)}}
                >
                    {({handleSubmit, handleChange, values, errors}) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group controlId='code'>
                                <Form.Label column="lg">
                                    Enter the unique ID of the Store you want to join
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    name='code'
                                    value={values.code}
                                    onChange={handleChange}
                                    isInvalid={!!errors.code}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.code}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button type='submit'>
                                Join Store
                            </Button>
                            {error && <p>{error}</p>}
                        </Form>
                    )
                    }
                </Formik>
            </>}
        </Row>
    )
}

export default JoinStore;