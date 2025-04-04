import {Formik} from "formik";
import * as yup from "yup";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {login} from "../features/auth/authSlice.js";
import {useDispatch} from "react-redux";
import {Input, Label, SizableText, Form, Spinner, H1, H2, H4, Separator} from "tamagui";
import {AtSign, LogIn} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "../tamagui.config.ts";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

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
            email: 'bergnaum.patience@example.com',
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
        <HorizontalContainer width="95%" alignSelf="center">
            <VerticalContainer
                borderRadius="$5"
                alignSelf="center"
                boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                padding="$3"
                width={screenSize > 1280 ? '30%' : screenSize > 768 ? '50%' : '100%'}
            >
                <H2>Login</H2>
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
                                    <Label htmlFor="email">
                                        <H4>Email</H4>
                                    </Label>
                                    <Input
                                        flex={1}
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
                                <Separator />
                                <VerticalContainer>
                                    <Label htmlFor="password">
                                        <H4>Password</H4>
                                    </Label>
                                    <Input
                                        flex={1}
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
                                <Separator />
                                <Form.Trigger asChild>
                                    <BigButton icon={LogIn} type="submit">Sign in</BigButton>
                                </Form.Trigger>
                                {serverError && <SizableText color='red' >{serverError}</SizableText>}
                                <SmallButton onClick={() => handleAdminLogin()}>Log in as Admin (Dev)</SmallButton>
                                <Separator />
                                <SizableText>Don't have an account yet?</SizableText>
                                <SmallButtonWithAccent icon={AtSign} onClick={() => navigate('/register')}>Sign up</SmallButtonWithAccent>
                            </VerticalContainer>
                        </Form>
                    )}
                </Formik>
            </VerticalContainer>
            {screenSize > 768 &&
                <VerticalContainer height='100%' width={screenSize > 1280 ? '70%' : screenSize > 768 ? '50%' : '100%'} alignItems="center">
                    <H1>Welcome back!</H1>
                </VerticalContainer>
            }
        </HorizontalContainer>
    )
}

export default Login;