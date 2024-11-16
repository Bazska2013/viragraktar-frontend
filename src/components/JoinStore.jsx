import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig.js';
import {Button, Form, Row} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";

const JoinStore = () => {
    const navigate = useNavigate();

    const schema = yup.object().shape({
        code: yup.string().min(6, "Code's length is incorrect").max(6, "Code's length is incorrect").required('Code is required'),
    });

    const handleSubmit = async (values) => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.post('/api/join', {
                unique_id: values.code,
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                navigate('/sell', {replace: true});
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Row>
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
                    </Form>
                )
                }
            </Formik>
        </Row>
    )
}

export default JoinStore;