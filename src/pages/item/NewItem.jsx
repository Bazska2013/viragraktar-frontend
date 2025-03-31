import {Formik} from "formik";
import {SizableText, Form, Spinner, Label, Input, TextArea} from "tamagui";
import * as yup from "yup";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Save, Upload} from "@tamagui/lucide-icons";
import {BigButton, EditContainer, SmallButton, VerticalContainer} from "../../tamagui.config.ts";

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
        <EditContainer>
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
                        <VerticalContainer>
                            <VerticalContainer>
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
                            </VerticalContainer>
                            <VerticalContainer>
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
                            </VerticalContainer>
                            <VerticalContainer>
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
                            </VerticalContainer>
                            <VerticalContainer>
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
                            </VerticalContainer>
                            <VerticalContainer>
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
                                <SmallButton icon={Upload} onClick={() => document.getElementById('image').click()}>Choose File</SmallButton>
                                {image && <SizableText>Selected file: {image.name}</SizableText>}
                            </VerticalContainer>
                            <Form.Trigger asChild>
                                <BigButton icon={Save} type="submit">Add new Item</BigButton>
                            </Form.Trigger>
                            {serverError && <SizableText color='red' >{serverError}</SizableText>}
                        </VerticalContainer>
                    </Form>
                )}
            </Formik>
        </EditContainer>
    )
}

export default NewItem;