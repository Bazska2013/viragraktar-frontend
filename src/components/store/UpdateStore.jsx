import {Formik} from "formik";
import {useState} from "react";
import axios from "../../axiosConfig.js";
import SelectOpeningHours from "./SelectOpeningHours.jsx";
import {useDispatch, useSelector} from "react-redux";
import {createStore, selectStore} from "../../features/store/storeSlice.js";
import {Checkbox, Input, Label, SizableText, Form, Spinner, H4, Separator, H2} from "tamagui";
import {Check, Save} from "@tamagui/lucide-icons";
import {BigButton, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";

const UpdateStore = () => {
    const store = useSelector(selectStore);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/store', {
                name: values.name,
                opening_hours: values.opening_hours,
                calculation_enabled: values.calculation_enabled,
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
            <Spinner>
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
                        calculation_enabled: store ? !!store.calculation_enabled : false,
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
                                    <Label htmlFor="calculation_enabled">
                                        <H4>Enable price calculation</H4>
                                    </Label>
                                    <Checkbox id="calculation_enabled" name="calculation_enabled" checked={values.calculation_enabled} onCheckedChange={(checked) => setFieldValue('calculation_enabled', checked)}>
                                        <Checkbox.Indicator>
                                            <Check />
                                        </Checkbox.Indicator>
                                    </Checkbox>
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

export default UpdateStore;