import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig.js';
import {Formik} from "formik";
import * as yup from "yup";
import {useState} from "react";
import {Input, Label, SizableText, YStack, Button, Form, Spinner} from "tamagui";
import {LogIn, PenSquare} from "@tamagui/lucide-icons";

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
            if (response?.status === 200) {
                navigate('/sell', {replace: true});
            }
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
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        code: '',
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
                                    <Label htmlFor="code">
                                        Enter the unique ID of the Store you want to join
                                    </Label>
                                    <Input
                                        flex={1}
                                        size="$3"
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
                                </YStack>
                                <Form.Trigger asChild>
                                    <Button icon={PenSquare} theme="accent" size="$6" type="submit">Join store</Button>
                                </Form.Trigger>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </YStack>
                        </Form>
                    )
                    }
                </Formik>
            </YStack>}
        </YStack>
    )
}

export default JoinStore;