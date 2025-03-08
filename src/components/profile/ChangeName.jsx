import {Formik} from "formik";
import * as yup from "yup";
import axios from "../../axiosConfig.js";
import {setUser} from "../../features/auth/userSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {H1, H2, Input, Label, SizableText, YStack, Form, Spinner, Button} from "tamagui";
import {Save} from "@tamagui/lucide-icons";
import {BigButton, EditContainer, VerticalContainer} from "../../tamagui.config.ts";

const ChangeName = ({user}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/change-name', {
                name: values.name,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                dispatch(setUser(response.data));
                navigate('/edit/profile', {replace: true});
            }
        }
    }

    return (
        <EditContainer>
            {isLoading ? <>
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <VerticalContainer>
                <H2>Change Name</H2>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            name: user.name,
                            email: user.email
                        }}
                        onSubmit={(values) => {handleSubmit(values)}}
                    >
                        {({handleSubmit: formikSubmit, handleChange, values, errors}) => (
                            <Form noValidate onSubmit={formikSubmit}>
                                <VerticalContainer>
                                    <Label htmlFor='name'>Name</Label>
                                    <Input
                                        flex={1}
                                        // size="$3"
                                        borderWidth={2}
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                    />
                                    <SizableText size='small' color='red'>
                                        {errors.name}
                                    </SizableText>
                                </VerticalContainer>
                                <VerticalContainer>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        flex={1}
                                        // size="$3"
                                        borderWidth={2}
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        disabled
                                    />
                                </VerticalContainer>
                                <Form.Trigger asChild>
                                    <BigButton icon={Save} type='submit'>Change name</BigButton>
                                </Form.Trigger>
                                {error && <SizableText color="red">{error}</SizableText>}
                            </Form>
                        )}
                    </Formik>
            </VerticalContainer>}
        </EditContainer>
    );
}

export default ChangeName;