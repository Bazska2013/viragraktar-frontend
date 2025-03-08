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
import {BigButton, EditContainer, VerticalContainer} from "../../tamagui.config.ts";

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
        <EditContainer>
            {isLoading ? <>
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <VerticalContainer>
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
                            <VerticalContainer>
                                <Label htmlFor="old_password">Old password</Label>
                                <Input
                                    flex={1}
                                    // size="$3"
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
                            </VerticalContainer>
                            <VerticalContainer>
                                <Label htmlFor="password1">New password</Label>
                                <Input
                                    flex={1}
                                    // size="$3"
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
                            </VerticalContainer>
                            <VerticalContainer>
                                <Label htmlFor="password2">New password again</Label>
                                <Input
                                    flex={1}
                                    // size="$3"
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
                            </VerticalContainer>
                            <Form.Trigger asChild>
                                <BigButton icon={Save} type='submit'>Change password</BigButton>
                            </Form.Trigger>
                            {error && <SizableText color="red">{error}</SizableText>}
                            <SizableText>Disclaimer: You have to log in again after changing your password.</SizableText>
                        </Form>
                    )}
                </Formik>
            </VerticalContainer>}
        </EditContainer>
    );
}

export default ChangePassword;