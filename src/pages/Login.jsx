import {Formik} from "formik";
import * as yup from "yup";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {login} from "../features/auth/authSlice.js";
import {useDispatch} from "react-redux";
import {Input, Label, SizableText, Form, Spinner, H1, H2, H4, Separator, H6, Square} from "tamagui";
import {AtSign, LogIn, ShoppingCart, Store, User} from "lucide-react";
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../tamagui.config.ts";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [currentIcon, setCurrentIcon] = useState('store');

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
        } catch (error) {
            setIsLoading(false);
            setServerError(error.response?.data?.message);
        } finally {
            let token;
            if (typeof response?.data === 'string') {
                token = response.data.split('|')[1];
            } else {
                token = response?.data?.token;
            }
            if (token) {
                dispatch(login(token));
                if (document.startViewTransition) {
                    document.startViewTransition(() => {
                        navigate('/sell', { replace: true });
                    });
                } else {
                    navigate('/sell', { replace: true });
                }
            }
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIcon((prevIcon) => {
                if (prevIcon === 'store') {
                    return 'cart';
                } else if (prevIcon === 'cart') {
                    return 'profile';
                } else {
                    return 'store';
                }
            });
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    if (isLoading) {
        return (
            <Spinner color="#292023">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <HorizontalContainer width="95%" alignSelf="center" marginBottom="5rem">
            <VerticalContainer
                borderRadius="$5"
                alignSelf="center"
                boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                padding="$3"
                width={screenSize > 1280 ? '30%' : screenSize > 768 ? '50%' : '100%'}
                backgroundColor="white"
            >
                <H2>Login</H2>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    onSubmit={(values) => {handleSubmit(values).then(() => setIsLoading(false))}}
                >
                    {({handleSubmit: formikSubmit, handleChange, values, errors}) => (
                        <Form noValidate onSubmit={formikSubmit}>
                            <VerticalContainer>
                                <VerticalContainer>
                                    <Label htmlFor="email">
                                        <H4>Email</H4>
                                    </Label>
                                    <Input
                                        backgroundColor="none"
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
                                        backgroundColor="none"
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
                                <Separator />
                                <SizableText>Don't have an account yet?</SizableText>
                                <SmallButtonWithAccent icon={AtSign} onClick={() => {document.startViewTransition ? document.startViewTransition(() => navigate('/register')) : navigate('/register')}}>Sign up</SmallButtonWithAccent>
                            </VerticalContainer>
                        </Form>
                    )}
                </Formik>
            </VerticalContainer>
            {screenSize > 768 &&
                <VerticalContainer width={screenSize > 1280 ? '70%' : screenSize > 768 ? '50%' : '100%'} height="max-content" alignSelf="center">
                    <VerticalContainer alignSelf="center" alignItems="center">
                        <H1>Welcome back to Shopkeep!</H1>
                        <H6>Log in to start managing your store</H6>
                    </VerticalContainer>
                    <VerticalContainer alignItems="center">
                        <Square position="absolute" animation="slow" opacity={currentIcon === 'store' ? 1 : 0} rotate={currentIcon === 'store' ? '0deg' : '360deg'} scale={currentIcon === 'store' ? 1 : 0}>
                            <Store size={150} />
                        </Square>
                        <Square position="absolute" animation="slow" opacity={currentIcon === 'cart' ? 1 : 0} rotate={currentIcon === 'cart' ? '360deg' : '0deg'} scale={currentIcon === 'cart' ? 1 : 0}>
                            <ShoppingCart size={150} />
                        </Square>
                        <Square position="absolute" animation="slow" opacity={currentIcon === 'profile' ? 1 : 0} rotate={currentIcon === 'profile' ? '0deg' : '360deg'} scale={currentIcon === 'profile' ? 1 : 0}>
                            <User size={150} />
                        </Square>
                    </VerticalContainer>
                </VerticalContainer>
            }
        </HorizontalContainer>
    )
}

export default React.memo(Login);