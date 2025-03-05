import {Formik} from "formik";
import * as yup from 'yup';
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {removeUser, setUser} from "../../features/auth/userSlice.js";
import {useDispatch} from "react-redux";
import {logout} from "../../features/auth/authSlice.js";
import {deleteStore} from "../../features/store/storeSlice.js";
import {useState} from "react";
import {H2, Input, Label, SizableText, YStack, Form, Button, Spinner} from "tamagui";
import {Save} from "@tamagui/lucide-icons";

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
        <YStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$2"
            padding="$2"
            justifyContent="space-between"
        >
            {isLoading ? <>
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <YStack
                flex={1}
                borderWidth={2}
                borderColor="$color"
                borderRadius="$4"
                gap="$2"
                padding="$2"
                justifyContent="space-between"
            >
                <H2>Change Password</H2>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        old_password: '',
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
                                <Label htmlFor="old_password">Old password</Label>
                                <Input
                                    flex={1}
                                    size="$3"
                                    borderWidth={2}
                                    type="password"
                                    name="old_password"
                                    value={values.old_password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.old_password}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.old_password}
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
                                <Label htmlFor="password1">New password</Label>
                                <Input
                                    flex={1}
                                    size="$3"
                                    borderWidth={2}
                                    type="password"
                                    name="password1"
                                    value={values.password1}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password1}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.password1}
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
                                <Label htmlFor="password2">New password again</Label>
                                <Input
                                    flex={1}
                                    size="$3"
                                    borderWidth={2}
                                    type="password"
                                    name="password2"
                                    value={values.password2}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password2}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.password2}
                                </SizableText>
                            </YStack>
                            <Form.Trigger asChild>
                                <Button icon={Save} theme="accent" size="$6" type='submit'>Change password</Button>
                            </Form.Trigger>
                            {error && <SizableText color="red">{error}</SizableText>}
                            <SizableText>Disclaimer: You have to log in again after changing your password.</SizableText>
                        </Form>
                    )}
                </Formik>
            </YStack>}
        </YStack>
    );
}

export default ChangePassword;