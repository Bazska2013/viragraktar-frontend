import {Formik} from 'formik';
import {Button, Form} from 'react-bootstrap';
import * as yup from 'yup';
import axios from "../axiosConfig.js";
import {login} from "../features/auth/authSlice.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const Register = () => {
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password1: yup.string().required('Password is required'),
        password2: yup.string().oneOf([yup.ref('password1'), null], 'Passwords must match').required('Password confirmation is required')
    })

    const handleSubmit = async (values) => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }).then(async () => {
                await axios.post('/register', {
                    email: values.email,
                    name: values.name,
                    password: values.password1,
                    password_confirmation: values.password2
                }, {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }).then((response) => {
                    console.log(response);
                    if (response.status === 204) {
                        login({
                            user: response.data.user,
                            accessToken: response.data.token
                        });
                        navigate('/profile', {replace: true});
                    } else {
                        setServerError(response.data.message);
                    }
                })
            })
            // const result = await authRegister(
            // {
            //         email: values.email,
            //         name: values.name,
            //         password: values.password1
            //     },
            //     {
            //         credentials: 'include',
            //     }
            // ).unwrap();
            // console.log(result);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{
                    email: '',
                    name: '',
                    password1: '',
                    password2: ''
                }}
                onSubmit={(values) => {handleSubmit(values)}}
            >
                {({handleSubmit, handleChange, values, errors}) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label column="lg">Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="abc@xyz.com"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.Label column="lg">Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="John Dover"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password1">
                            <Form.Label column="lg">Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password1"
                                value={values.password1}
                                onChange={handleChange}
                                isInvalid={!!errors.password1}
                            />
                        </Form.Group>
                        <Form.Control.Feedback type="invalid">
                            {errors.password1}
                        </Form.Control.Feedback>
                        <Form.Group controlId="password2">
                            <Form.Label column="lg">Password again</Form.Label>
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
            {serverError && <p>{serverError}</p>}
        </>
    )
}

export default Register;