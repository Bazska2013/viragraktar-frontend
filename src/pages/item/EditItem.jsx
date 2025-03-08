import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {Formik} from "formik";
import * as yup from "yup";
import {SizableText, Button, Form, Spinner, Label, Input, TextArea, XStack, Image, YStack} from "tamagui";
import {Save, Upload} from "@tamagui/lucide-icons";
import {BigButton, EditContainer, HorizontalContainer, SmallButton, VerticalContainer} from "../../tamagui.config.ts";

const EditItem = () => {
    const [item, setItem] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const id = useParams().id;
    const [image, setImage] = useState(null);

    const fetchItem = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/item/' + id);
        } catch (error) {
            setIsLoading(false);
            setFetchError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItem(response.data);
            }
        }
    }

    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        description: yup.string().required('Description is required'),
        price: yup.number().min(0, 'Price must be greater than or equal 0').required('Price is required'),
        stock: yup.number().min(0, 'Stock must be greater than or equal 0').required('Stock is required'),
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        try {
            const formDataForEdit = new FormData();
            formDataForEdit.set('name', values.name);
            formDataForEdit.set('description', values.description);
            formDataForEdit.set('price', values.price);
            formDataForEdit.set('stock', values.stock);
            for (let [key, value] of formDataForEdit.entries()) {
                console.log(key, value);
            }
            response = await axios.post('/api/item/edit/' + item.id, formDataForEdit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            setIsLoading(false);
            setServerError(error.response.data.message);
            console.log(error.response)
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                navigate('/buy', {replace: true});
            }
        }
    }

    useEffect(() => {
        fetchItem();
    }, []);

    if (isLoading) {
        return (
            <Spinner>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    if (fetchError) {
        return (
            <SizableText color="red" >{fetchError}</SizableText>
        )
    }

    return (
        <EditContainer>
            <Formik
                enableReinitialize
                validationSchema={schema}
                initialValues={{
                    name: item.name || '',
                    description: item.description || '',
                    price: item.price || 0,
                    stock: item.stock || 1,
                    /*image: item.image || ''*/
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
                                    flex={1}
                                    // size="$3"
                                    borderWidth={2}
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
                                    flex={1}
                                    // size="$3"
                                    borderWidth={2}
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
                                    flex={1}
                                    // size="$3"
                                    borderWidth={2}
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
                                    flex={1}
                                    // size="$3"
                                    borderWidth={2}
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
                                {item.image &&
                                    <HorizontalContainer>
                                        <SizableText>Current image:</SizableText>
                                        <Image source={{
                                            uri: "http://localhost:8000/images/" + item.image,
                                            width: 100,
                                            height: 100,
                                        }} />
                                    </HorizontalContainer>
                                }
                                <Label htmlFor='image'>
                                    {item.image? "Change image of the item" : "Image of the item"}
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
                                {image &&
                                    <SizableText>Selected file: {image.name}</SizableText>
                                }
                            </VerticalContainer>
                            <Form.Trigger asChild>
                                <BigButton icon={Save} type='submit'>Confirm changes</BigButton>
                            </Form.Trigger>
                            {serverError && <SizableText color="red">{serverError}</SizableText>}
                        </VerticalContainer>
                    </Form>
                )}
            </Formik>
        </EditContainer>
    )
}

export default EditItem;