import {Formik} from "formik";
import React, {useState} from "react";
import axios from "../../axiosConfig.js";
import SelectOpeningHours from "./SelectOpeningHours.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createStore, selectStore} from "../../features/store/storeSlice.js";
import {Checkbox, Input, Label, SizableText, Form, Spinner, H4, Separator, H2, Group, Switch} from "tamagui";
import {Check, Save} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";

const UpdateStore = () => {
    const store = useSelector(selectStore);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        let currency = {
            sign: values.sign,
            before: values.before,
        }
        try {
            response = await axios.put('/api/store', {
                name: values.name,
                opening_hours: values.opening_hours,
                currency: JSON.stringify(currency),
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                dispatch(createStore(response.data));
            }
        }
    }

    if (isLoading) {
        return (
            <Spinner color="#292023">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <VerticalContainer>
            <H2>Update store details</H2>
            <ProfileContainer>
                <Formik
                    initialValues={{
                        name: store ? store.name : '',
                        opening_hours: store ? store.opening_hours : '',
                        sign: store ? JSON.parse(store.currency).sign : '',
                        before: store ? JSON.parse(store.currency).before : false,
                    }}
                    onSubmit={(values) => {
                        handleSubmit(values)
                    }}
                >
                    {({handleSubmit: formikSubmit, handleChange, values, errors, setFieldValue}) => (
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
                                <SelectOpeningHours name="opening_hours" setFieldValue={setFieldValue} defaultValue={store.opening_hours} />
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
                                    <BigButton icon={Save} type="submit">Update store</BigButton>
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

export default React.memo(UpdateStore);