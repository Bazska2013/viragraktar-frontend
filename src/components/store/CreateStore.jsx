import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {Formik} from "formik";
import SelectOpeningHours from "./SelectOpeningHours.jsx";
import React, {useState} from "react";
import {Input, Label, SizableText, Form, Spinner, H4, Separator, Switch} from "tamagui";
import {Save} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";
import {createStore} from "../../features/store/storeSlice.js";
import {useDispatch} from "react-redux";
import {setUser} from "../../features/auth/userSlice.js";

const CreateStore = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        let currency = {
            sign: values.sign,
            before: values.before,
        }
        try {
            response = await axios.post('/api/store', {
                name: values.name,
                opening_hours: values.opening_hours,
                currency: JSON.stringify(currency),
            });
        } catch (error) {
            setIsLoading(false);
            if (error.response.status === 500) {
                setError('Server error, the given store name is already taken');
            } else {
                setError(error.response.data.message);
            }
        } finally {
            await Promise.all([
                dispatch(createStore(response.data)),
                fetchUserData()
            ]);
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    navigate('/buy', {replace: true});
                });
            } else {
                navigate('/buy', {replace: true});
            }
        }
    }

    const fetchUserData = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/user');
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                dispatch(setUser(response.data));
            }
        }
    }

    return (
        <VerticalContainer>
            <H4>Create a new store</H4>
            <ProfileContainer>
                <Formik
                    initialValues={{
                        name: '',
                        opening_hours: '',
                        before: false,
                        sign: '',
                    }}
                    onSubmit={(values) => {
                        handleSubmit(values).then(() => setIsLoading(false));
                    }}
                >
                    {({ handleSubmit: formikSubmit, handleChange, values, errors, setFieldValue }) => (
                        <Form noValidate onSubmit={formikSubmit}>
                            <VerticalContainer>
                                <VerticalContainer>
                                    <Label htmlFor="name">
                                        <H4>Name of your store</H4>
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
                                <SelectOpeningHours name="opening_hours" setFieldValue={setFieldValue} />
                                <Separator />
                                <VerticalContainer>
                                    <Label htmlFor="sign">
                                        <H4>Set the currency sign used in this store</H4>
                                    </Label>
                                    <Input
                                        backgroundColor="none"
                                        flex={1}
                                        borderWidth={2}
                                        type="text"
                                        name="sign"
                                        id="sign"
                                        value={values.sign}
                                        onChange={handleChange}
                                        isInvalid={!!errors.sign}
                                    />
                                    <Label htmlFor="before">
                                        <H4>Appear {values.before ? 'before' : 'after'} the price</H4>
                                    </Label>
                                    <HorizontalContainer>
                                        <SizableText>after</SizableText>
                                        <Switch size="$3" id="before" name="before" checked={values.before} onCheckedChange={(checked) => setFieldValue('before', checked)}>
                                            <Switch.Thumb animation="quicker" />
                                        </Switch>
                                        <SizableText>before</SizableText>
                                    </HorizontalContainer>
                                </VerticalContainer>
                                <Separator />
                                <Form.Trigger asChild>
                                    <BigButton icon={Save} type="submit">{isLoading ? <Spinner color="#FBF9EF" /> : 'Create store'}</BigButton>
                                </Form.Trigger>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </VerticalContainer>
                        </Form>
                    )}
                </Formik>
            </ProfileContainer>
        </VerticalContainer>
    )
}

export default React.memo(CreateStore);