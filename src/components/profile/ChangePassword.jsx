import {Button, Container, Form, Row, Spinner} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from 'yup';
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {removeUser, setUser} from "../../features/auth/userSlice.js";
import {useDispatch} from "react-redux";
import {logout} from "../../features/auth/authSlice.js";
import {deleteStore} from "../../features/store/storeSlice.js";
import {useState} from "react";

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const schema = yup.object().shape({
        old_password: yup.string().required('Old password is required'),
        password1: yup.string().required('Password is required'),
        password2: yup.string().oneOf([yup.ref('password1'), null], 'Passwords must match').required('Password confirmation is required')
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/change-password', {
                old_password: values.old_password,
                new_password: values.password1,
                new_password_confirmation: values.password2
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                handleLogout();
            }
        }
    }

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await axios.post('/logout');
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            dispatch(logout());
            dispatch(removeUser());
            dispatch(deleteStore());
            navigate('/login', {replace: true});
        }
    }

    return (
        <Container>
            {isLoading ? <>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <>
                <Row>
                    <h1>Change Password</h1>
                </Row>
                <Row>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            old_password: '',
                            password1: '',
                            password2: ''
                        }}
                        onSubmit={(values) => {handleSubmit(values)}}
                    >
                        {({handleSubmit, handleChange, values, errors}) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group controlId="old_password">
                                    <Form.Label column="lg">Old password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="old_password"
                                        value={values.old_password}
                                        onChange={handleChange}
                                        isInvalid={!!errors.old_password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.old_password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="password1">
                                    <Form.Label column="lg">New password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password1"
                                        value={values.password1}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password1}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password1}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="password2">
                                    <Form.Label column="lg">New password again</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password2"
                                        value={values.password2}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password2}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password2}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button type="submit">
                                    Change Password
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Row>
                <Row>
                    Disclaimer: You have to log in again after changing your password.
                </Row>
                {error && <Row>{error}</Row>}
            </>}
        </Container>
    );
}

export default ChangePassword;