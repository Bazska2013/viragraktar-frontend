import {Formik} from 'formik';
import * as yup from 'yup';
import axios from "../axiosConfig.js";
import {login} from "../features/auth/authSlice.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {Input, Label, SizableText, YStack, Form, Button, Spinner} from "tamagui";
import {FileSignature, LogIn} from "@tamagui/lucide-icons";

const Register = () => {
    const dispatch = useDispatch();
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            navigate('/login', {replace: true});
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
                    name: '',
                    password1: '',
                    password2: ''
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
                                <Label htmlFor='name'>Name</Label>
                                <Input
                                    flex={1}
                                    size="$3"
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
                                <Label htmlFor='password1'>Password</Label>
                                <Input
                                    flex={1}
                                    size="$3"
                                    borderWidth={2}
                                    type="password"
                                    name="password1"
                                    id="password1"
                                    secureTextEntry
                                    value={values.password1}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password1}
                                />
                            </YStack>
                            <SizableText size='small' color='red'>
                                {errors.password1}
                            </SizableText>
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                                justifyContent="space-between"
                            >
                                <Label htmlFor="password2">Password again</Label>
                                <Input
                                    flex={1}
                                    size="$3"
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
                            </YStack>
                            <Form.Trigger asChild>
                                <Button icon={FileSignature} theme="accent" size="$6" type="submit">Register</Button>
                            </Form.Trigger>
                            {serverError && <SizableText color='red' >{serverError}</SizableText>}
                        </YStack>
                    </Form>
                )}
            </Formik>
        </YStack>
    )
}

export default Register;