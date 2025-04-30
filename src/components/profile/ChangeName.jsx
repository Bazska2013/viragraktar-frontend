import {Formik} from "formik";
import * as yup from "yup";
import axios from "../../axiosConfig.js";
import {setUser} from "../../features/auth/userSlice.js";
import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {H2, Input, Label, SizableText, Form, Spinner, H4, Separator} from "tamagui";
import {UserPen} from "lucide-react";
import {BigButton, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";
import PropTypes from "prop-types";

const ChangeName = ({user}) => {
    const dispatch = useDispatch();
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
            if (response?.status === 200) {
                dispatch(setUser(response.data));
            }
        }
    }

    return (
        <VerticalContainer>
            <H2>Change name</H2>
            <ProfileContainer>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        name: user.name,
                        email: user.email
                    }}
                    onSubmit={(values) => {handleSubmit(values).then(() => setIsLoading(false))}}
                >
                    {({handleSubmit: formikSubmit, handleChange, values, errors}) => (
                        <Form noValidate onSubmit={formikSubmit}>
                            <VerticalContainer>
                                <Label htmlFor="name">
                                    <H4>Name</H4>
                                </Label>
                                <Input
                                    backgroundColor="none"
                                    flex={1}
                                    borderWidth={2}
                                    type="text"
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
                            <Form.Trigger asChild>
                                <BigButton icon={UserPen} type='submit'>{isLoading ? <Spinner color="#FBF9EF" /> : 'Change name'}</BigButton>
                            </Form.Trigger>
                            {error && <SizableText color="red">{error}</SizableText>}
                        </Form>
                    )}
                </Formik>
            </ProfileContainer>
        </VerticalContainer>
    );
}

ChangeName.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
}

export default React.memo(ChangeName);