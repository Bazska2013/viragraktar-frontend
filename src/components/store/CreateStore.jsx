import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {Formik} from "formik";
import SelectOpeningHours from "./SelectOpeningHours.jsx";
import {useState} from "react";
import {Checkbox, Input, Label, SizableText, Form, Spinner, H4, Separator} from "tamagui";
import {Check, Save} from "@tamagui/lucide-icons";
import {BigButton, VerticalContainer} from "../../tamagui.config.ts";

const CreateStore = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/store', {
                name: values.name,
                opening_hours: values.opening_hours,
                calculation_enabled: values.calculation_enabled,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                navigate('/sell', {replace: true});
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
            <Formik
                initialValues={{
                    name: '',
                    opening_hours: '',
                    calculation_enabled: false,
                }}
                onSubmit={(values) => {
                    handleSubmit(values)
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
                                <BigButton icon={Save} type="submit">Create store</BigButton>
                            </Form.Trigger>
                            {error && <SizableText color='red' >{error}</SizableText>}
                        </VerticalContainer>
                    </Form>
                )}
            </Formik>
        </VerticalContainer>
    )
}

export default CreateStore;