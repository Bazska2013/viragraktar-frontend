import {Formik} from 'formik';
import * as yup from 'yup';
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Input, Label, SizableText, Form, Spinner, H2, H4, Separator, H1} from "tamagui";
import {FileSignature, LogIn} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../tamagui.config.ts";

const Register = () => {
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

    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password1: yup.string().required('Password is required'),
        password2: yup.string().oneOf([yup.ref('password1'), null], 'Passwords must match').required('Password confirmation is required')
    })

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/register', {
                email: values.email,
                name: values.name,
                password: values.password1,
                password_confirmation: values.password2
            });
        } catch (error) {
            setIsLoading(false);
            setServerError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response.status === 401) {
                navigate('/login', {replace: true});
            }
        }
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
                <H2>Register</H2>
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
                                <SmallButtonWithAccent onClick={() => navigate('/login')} icon={LogIn}>Sign in</SmallButtonWithAccent>
                                {serverError && <SizableText color='red' >{serverError}</SizableText>}
                            </VerticalContainer>
                        </Form>
                    )}
                </Formik>
            </VerticalContainer>
            {screenSize > 768 &&
                <VerticalContainer height='100%' width={screenSize > 1280 ? '70%' : screenSize > 768 ? '50%' : '100%'} alignItems="center">
                    <H1>Welcome!</H1>
                </VerticalContainer>
            }
        </HorizontalContainer>
    )
}

export default Register;