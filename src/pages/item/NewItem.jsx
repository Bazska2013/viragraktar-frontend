import {Formik} from "formik";
import {SizableText, Button, Form, Spinner, Label, Input, TextArea, XStack, Image, YStack} from "tamagui";
import * as yup from "yup";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Save, Upload} from "@tamagui/lucide-icons";

const NewItem = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [image, setImage] = useState(null);

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        description: yup.string().required('Description is required'),
        price: yup.number().min(0, 'Price must be greater than or equal 0').required('Price is required'),
        stock: yup.number().min(1, 'Stock must be greater than 0').required('Stock is required'),
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            const formDataForNew = new FormData();
            formDataForNew.set('name', values.name);
            formDataForNew.set('description', values.description);
            formDataForNew.set('price', values.price);
            formDataForNew.set('stock', values.stock);
            if (image) {
                formDataForNew.set('image', image);
            }
            response = await axios.post('/api/item', formDataForNew, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            setIsLoading(false);
            setServerError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                navigate('/buy', {replace: true});
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
                validationSchema={schema}
                initialValues={{
                    name: '',
                    description: '',
                    price: 1000,
                    stock: 1,
                }}
                onSubmit={(values) => handleSubmit(values)}
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
                                    Name of the item
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.name}
                                </SizableText>
                            </YStack>
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                            >
                                <Label htmlFor="description">
                                    Description of the item
                                </Label>
                                <TextArea
                                    rows={3}
                                    id="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    isInvalid={!!errors.description}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.description}
                                </SizableText>
                            </YStack>
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                            >
                                <Label htmlFor="price">
                                    Price of the item
                                </Label>
                                <Input
                                    type="number"
                                    id="price"
                                    min={0}
                                    value={values.price}
                                    onChange={handleChange}
                                    isInvalid={!!errors.price}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.price}
                                </SizableText>
                            </YStack>
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                            >
                                <Label htmlFor="stock">
                                    Stock of the item
                                </Label>
                                <Input
                                    type="number"
                                    id="stock"
                                    min={1}
                                    value={values.stock}
                                    onChange={handleChange}
                                    isInvalid={!!errors.stock}
                                />
                                <SizableText size='small' color='red'>
                                    {errors.stock}
                                </SizableText>
                            </YStack>
                            <YStack
                                flex={1}
                                borderWidth={2}
                                borderColor="$color"
                                borderRadius="$4"
                                gap="$2"
                                padding="$2"
                            >
                                <Label htmlFor='image'>
                                    Image of the item
                                </Label>
                                <input
                                    type="file"
                                    id="image"
                                    accept='image/*'
                                    hidden
                                    onChange={(event) => {
                                        setImage(event.currentTarget.files[0]);
                                    }}
                                />
                                <Button icon={Upload} size="$3" onClick={() => document.getElementById('image').click()}>Choose File</Button>
                                {image && <SizableText>Selected file: {image.name}</SizableText>}
                            </YStack>
                            <Form.Trigger asChild>
                                <Button icon={Save} theme="accent" size="$6" type="submit">Add new Item</Button>
                            </Form.Trigger>
                            {serverError && <SizableText color='red' >{serverError}</SizableText>}
                        </YStack>
                    </Form>
                )}
            </Formik>
        </YStack>
    )
}

export default NewItem;