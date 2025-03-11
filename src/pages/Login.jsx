import {Formik} from "formik";
import * as yup from "yup";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {login} from "../features/auth/authSlice.js";
import {useDispatch} from "react-redux";
import {Input, Label, SizableText, YStack, Button, Form, Spinner} from "tamagui";
import {AtSign, LogIn, Save} from "@tamagui/lucide-icons";
import {BigButton, EditContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "../tamagui.config.ts";

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
            response = await axios.post('/api/login', {
                email: values.email,
                password: values.password,
                device_name: 'web'
            });
            console.log(response);
        } catch (error) {
            setIsLoading(false);
            setServerError(error.response?.data?.message);
        } finally {
            setIsLoading(false);
            let token;
            if (typeof response?.data === 'string') {
                token = response.data.split('|')[1];
            } else {
                token = response?.data?.token;
            }
            if (token) {
                dispatch(login(token));
                navigate('/sell', { replace: true });
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
            <Spinner>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <EditContainer>
            <Formik
                validationSchema={schema}
                initialValues={{
                    email: '',
                    password: ''
                }}
                onSubmit={(values) => {handleSubmit(values)}}
            >
                {({handleSubmit: formikSubmit, handleChange, values, errors}) => (
                    <Form noValidate onSubmit={formikSubmit}>
                        <VerticalContainer>
                            <VerticalContainer>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    flex={1}
                                    // size="$3"
                                    borderWidth={2}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="abc@xyz.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.email}
                                </SizableText>
                            </VerticalContainer>
                            <VerticalContainer>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    flex={1}
                                    // size="$3"
                                    borderWidth={2}
                                    type="password"
                                    name="password"
                                    id="password"
                                    secureTextEntry
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.password}
                                </SizableText>
                            </VerticalContainer>
                            <Form.Trigger asChild>
                                <BigButton icon={LogIn} type="submit">Sign in</BigButton>
                            </Form.Trigger>
                            {serverError && <SizableText color='red' >{serverError}</SizableText>}
                            <SmallButton onClick={() => handleAdminLogin()}>Log in as Admin (Dev)</SmallButton>
                            <SizableText>Don't have an account yet?</SizableText>
                            <SmallButtonWithAccent icon={AtSign} onClick={() => navigate('/register')}>Sign up</SmallButtonWithAccent>
                        </VerticalContainer>
                    </Form>
                )}
            </Formik>
        </EditContainer>
    )
}

export default Login;