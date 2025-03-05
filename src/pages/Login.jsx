import {Formik} from "formik";
import * as yup from "yup";
import axios from "../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {login} from "../features/auth/authSlice.js";
import {useDispatch} from "react-redux";
import {Input, Label, SizableText, YStack, Button, Form, Spinner} from "tamagui";
import {LogIn, Save} from "@tamagui/lucide-icons";

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
        <YStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$2"
            padding="$2"
            justifyContent="space-between"
        >
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
                        <YStack
                            flex={1}
                            borderWidth={2}
                            borderColor="$color"
                            borderRadius="$4"
                            gap="$2"
                            padding="$2"
                            justifyContent="space-between"
                        >
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                                justifyContent="space-between"
                            >
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    flex={1}
                                    size="$3"
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
                            </YStack>
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                                justifyContent="space-between"
                            >
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    flex={1}
                                    size="$3"
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
                            </YStack>
                            <Form.Trigger asChild>
                                <Button icon={LogIn} theme="accent" size="$6" type="submit">Log in</Button>
                            </Form.Trigger>
                            {serverError && <SizableText color='red' >{serverError}</SizableText>}
                            <Button size="$3" onClick={() => handleAdminLogin()}>Log in as Admin (Dev)</Button>
                        </YStack>
                    </Form>
                )}
            </Formik>
        </YStack>
    )
}

export default Login;