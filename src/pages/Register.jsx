import {Formik} from 'formik';
import * as yup from 'yup';
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Input, Label, SizableText, Form, Spinner, H2, H4, Separator, H1, H6, Square} from "tamagui";
import {FileSignature, LogIn, ShoppingCart, Store, User} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../tamagui.config.ts";

const Register = () => {
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentIcon, setCurrentIcon] = useState('store');

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

    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password1: yup.string().required('Password is required'),
        password2: yup.string().oneOf([yup.ref('password1'), null], 'Passwords must match').required('Password confirmation is required')
    })

    const handleSubmit = async (values) => {
        setIsLoading(true);
        try {
            await axios.post('/api/register', {
                email: values.email,
                name: values.name,
                password: values.password1,
                password_confirmation: values.password2
            });
        } catch (error) {
            setIsLoading(false);
            setServerError(error.response.data.message);
        } finally {
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    navigate('/login', {replace: true});
                });
            } else {
                navigate('/login', {replace: true});
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
                <H2>Register</H2>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        email: '',
                        name: '',
                        password1: '',
                        password2: ''
                    }}
                    onSubmit={(values) => {handleSubmit(values).then(() => setIsLoading(false))}}
                >
                    {({handleSubmit: formikSubmit, handleChange, values, errors}) => (
                        <Form noValidate onSubmit={formikSubmit}>
                            <VerticalContainer gap="$2">
                                <VerticalContainer>
                                    <Label htmlFor="email">
                                        <H4>Email</H4>
                                    </Label>
                                    <Input
                                        backgroundColor="none"
                                        flex={1}
                                        borderWidth={2}
                                        type="email"
                                        placeholder="abc@xyz.com"
                                        name="email"
                                        id="email"
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
                                    <Label htmlFor='name'>
                                        <H4>Name</H4>
                                    </Label>
                                    <Input
                                        backgroundColor="none"
                                        flex={1}
                                        borderWidth={2}
                                        type="text"
                                        placeholder="John Dover"
                                        name="name"
                                        id="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                    />
                                    <SizableText size='small' color='red'>
                                        {errors.name}
                                    </SizableText>
                                </VerticalContainer>
                                <Separator />
                                <VerticalContainer>
                                    <Label htmlFor='password1'>
                                        <H4>Password</H4>
                                    </Label>
                                    <Input
                                        backgroundColor="none"
                                        flex={1}
                                        borderWidth={2}
                                        type="password"
                                        name="password1"
                                        id="password1"
                                        secureTextEntry
                                        value={values.password1}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password1}
                                    />
                                    <SizableText size='small' color='red'>
                                        {errors.password1}
                                    </SizableText>
                                </VerticalContainer>
                                <Separator />
                                <VerticalContainer>
                                    <Label htmlFor="password2">
                                        <H4>Password again</H4>
                                    </Label>
                                    <Input
                                        backgroundColor="none"
                                        flex={1}
                                        borderWidth={2}
                                        type="password"
                                        name="password2"
                                        id="password2"
                                        secureTextEntry
                                        value={values.password2}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password2}
                                    />
                                    <SizableText size='small' color='red'>
                                        {errors.password2}
                                    </SizableText>
                                </VerticalContainer>
                                <Separator />
                                <Form.Trigger asChild>
                                    <BigButton icon={FileSignature} type="submit">Register</BigButton>
                                </Form.Trigger>
                                <Separator />
                                <SizableText>Already have an account?</SizableText>
                                <SmallButtonWithAccent onClick={() => {document.startViewTransition ? document.startViewTransition(() => navigate('/login', {replace: true})) : navigate('/login', {replace: true})}} icon={LogIn}>Sign in</SmallButtonWithAccent>
                                {serverError && <SizableText color='red' >{serverError}</SizableText>}
                            </VerticalContainer>
                        </Form>
                    )}
                </Formik>
            </VerticalContainer>
            {screenSize > 768 &&
                <VerticalContainer width={screenSize > 1280 ? '70%' : screenSize > 768 ? '50%' : '100%'} height="max-content" alignSelf="center">
                    <VerticalContainer alignSelf="center" alignItems="center">
                        <H1>Welcome to Shopkeep!</H1>
                        <H6>Make an account and log in to start managing your store</H6>
                    </VerticalContainer>
                    <VerticalContainer alignItems="center">
                        <Square position="absolute" animation="slow" opacity={currentIcon === 'store' ? 1 : 0} rotate={currentIcon === 'store' ? '0deg' : '360deg'} scale={currentIcon === 'store' ? 1 : 0}>
                            <Store size="$15" />
                        </Square>
                        <Square position="absolute" animation="slow" opacity={currentIcon === 'cart' ? 1 : 0} rotate={currentIcon === 'cart' ? '360deg' : '0deg'} scale={currentIcon === 'cart' ? 1 : 0}>
                            <ShoppingCart size="$15" />
                        </Square>
                        <Square position="absolute" animation="slow" opacity={currentIcon === 'profile' ? 1 : 0} rotate={currentIcon === 'profile' ? '0deg' : '360deg'} scale={currentIcon === 'profile' ? 1 : 0}>
                            <User size="$15" />
                        </Square>
                    </VerticalContainer>
                </VerticalContainer>
            }
        </HorizontalContainer>
    )
}

export default React.memo(Register);