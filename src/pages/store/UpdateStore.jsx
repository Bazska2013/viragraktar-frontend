import {Formik} from "formik";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import SelectOpeningHours from "../../components/store/SelectOpeningHours.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createStore, selectStore} from "../../features/store/storeSlice.js";
import {Checkbox, Input, Label, SizableText, XStack, YStack, Button, Form, Spinner} from "tamagui";
import {Check, Save} from "@tamagui/lucide-icons";

const UpdateStore = () => {
    const store = useSelector(selectStore);
    const navigate = useNavigate();
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
                navigate('/profile', {replace: true});
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
        <YStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$2"
            padding="$2"
        >
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
                        <YStack
                            flex={1}
                            borderWidth={2}
                            borderColor="$color"
                            borderRadius="$4"
                            gap="$2"
                            padding="$2"
                        >
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                            >
                                <Label htmlFor="name">
                                    Name of your store
                                </Label>
                                <Input
                                    flex={1}
                                    size="$3"
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
                            </YStack>
                            <SelectOpeningHours name="opening_hours" setFieldValue={setFieldValue} defaultValue={store.opening_hours} />
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                            >
                                <Label htmlFor="calculation_enabled">Enable price calculation</Label>
                                <Checkbox id="calculation_enabled" name="calculation_enabled" size="$3" checked={values.calculation_enabled} onCheckedChange={(checked) => setFieldValue('calculation_enabled', checked)}>
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                            </YStack>
                            <Form.Trigger asChild>
                                <Button icon={Save} theme="accent" size="$6" type="submit">Update store</Button>
                            </Form.Trigger>
                            {error && <SizableText color='red' >{error}</SizableText>}
                        </YStack>
                    </Form>
                )}

            </Formik>
        </YStack>
    )
}

export default UpdateStore;