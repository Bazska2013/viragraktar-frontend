import {Formik} from "formik";
import * as yup from 'yup';
import axios from "../../axiosConfig.js";
import {setUser} from "../../features/auth/userSlice.js";
import {useState} from "react";
import {H2, Input, Label, SizableText, Form, Spinner, H4, Separator} from "tamagui";
import {BookKey} from "@tamagui/lucide-icons";
import {BigButton, VerticalContainer} from "../../tamagui.config.ts";

const ChangePassword = () => {
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
                setUser(response.data);
            }
        }
    }

    return (
        <VerticalContainer>
            {isLoading ? <>
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <VerticalContainer>
                <H2>Change password</H2>
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
                                <Label htmlFor="old_password">
                                    <H4>Old password</H4>
                                </Label>
                                <Input
                                    flex={1}
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
                            <Separator />
                            <VerticalContainer>
                                <Label htmlFor="password1">
                                    <H4>New password</H4>
                                </Label>
                                <Input
                                    flex={1}
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
                            <Separator />
                            <VerticalContainer>
                                <Label htmlFor="password2">
                                    <H4>New password again</H4>
                                </Label>
                                <Input
                                    flex={1}
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
                            <Separator />
                            <Form.Trigger asChild>
                                <BigButton icon={BookKey} type='submit'>{isLoading ? <Spinner /> : 'Change password'}</BigButton>
                            </Form.Trigger>
                            {error && <SizableText color="red">{error}</SizableText>}
                        </Form>
                    )}
                </Formik>
            </VerticalContainer>}
        </VerticalContainer>
    );
}

export default ChangePassword;