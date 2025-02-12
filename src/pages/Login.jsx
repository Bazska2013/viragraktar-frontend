import {Formik} from "formik";
import {Button, Form, Spinner} from "react-bootstrap";
import * as yup from "yup";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {login} from "../features/auth/authSlice.js";
import {useDispatch} from "react-redux";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const schema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().required('Password is required')
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
            response = await axios.post('/login', {
                email: values.email,
                password: values.password
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            })
        } catch (error) {
            setIsLoading(false);
            setServerError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 204) {
                dispatch(login());
                navigate('/sell', {replace: true});
            }
        }
    }

    const handleAdminLogin = () => {
        handleSubmit({
            email: 'test@test.com',
            password: '12345678',
        })
    }

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{
                    email: '',
                    password: ''
                }}
                onSubmit={(values) => {handleSubmit(values)}}
            >
                {({handleSubmit, handleChange, values, errors}) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="abc@xyz.com"
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit">
                            Log in
                        </Button>
                        <Button variant="secondary" onClick={() => handleAdminLogin()}>Log in as Admin (Dev)</Button>
                    </Form>
                )}
            </Formik>
            {serverError && <p>{serverError}</p>}
        </>
    )
}

export default Login;