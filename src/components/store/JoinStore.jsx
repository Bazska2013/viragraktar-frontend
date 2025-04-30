import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig.js';
import {Formik} from "formik";
import * as yup from "yup";
import React, {useState} from "react";
import {Input, Label, SizableText, Form, Spinner, H4} from "tamagui";
import {PenSquare} from "lucide-react";
import {BigButton, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";

const JoinStore = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const schema = yup.object().shape({
        code: yup.string().min(6, "Code's length is incorrect").max(6, "Code's length is incorrect").required('Code is required'),
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/join', {
                unique_id: values.code,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response.status === 200) {
                if (document.startViewTransition) {
                    document.startViewTransition(() => {
                        navigate('/sell', {replace: true});
                    });
                } else {
                    navigate('/sell', {replace: true});
                }
            }
        }
    }

    return (
        <VerticalContainer>
            <H4>Join a store</H4>
            <ProfileContainer>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        code: '',
                    }}
                    onSubmit={(values) => {handleSubmit(values).then(() => setIsLoading(false))}}
                >
                    {({handleSubmit: formikSubmit, handleChange, values, errors}) => (
                        <Form noValidate onSubmit={formikSubmit}>
                            <VerticalContainer>
                                <VerticalContainer>
                                    <Label htmlFor="code">
                                        <H4>Enter the unique ID of the Store you want to join</H4>
                                    </Label>
                                    <Input
                                        backgroundColor="none"
                                        flex={1}
                                        borderWidth={2}
                                        type='text'
                                        name='code'
                                        id='code'
                                        value={values.code}
                                        onChange={handleChange}
                                        isInvalid={!!errors.code}
                                    />
                                    <SizableText size='small' color='red'>
                                        {errors.code}
                                    </SizableText>
                                </VerticalContainer>
                                <Form.Trigger asChild>
                                    <BigButton icon={PenSquare} type="submit">{isLoading ? <Spinner color="#FBF9EF" /> : "Join store"}</BigButton>
                                </Form.Trigger>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </VerticalContainer>
                        </Form>
                    )
                    }
                </Formik>
            </ProfileContainer>
        </VerticalContainer>
    )
}

export default React.memo(JoinStore);