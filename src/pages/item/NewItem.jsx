import {Formik} from "formik";
import {SizableText, Form, Spinner, Label, Input, H4, Separator, H2, Square, H6} from "tamagui";
import * as yup from "yup";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Save, Upload, X} from "lucide-react";
import {BigButton, EditContainer, HorizontalContainer, SmallButton, VerticalContainer} from "../../tamagui.config.ts";
import {useSelector} from "react-redux";
import {selectStore} from "../../features/store/storeSlice.js";
import Labels from "../../components/item/buy/Labels.jsx";

const NewItem = () => {
    const store = useSelector(selectStore);
    const [sign, setSign] = useState('');
    const [before, setBefore] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [image, setImage] = useState(null);
    const [labels, setLabels] = useState([]);

    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (store) {
            setSign(JSON.parse(store.currency).sign);
            setBefore(JSON.parse(store.currency).before);
        }
    }, [store]);

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        price: yup.number().min(0, 'Price must be greater than or equal 0').required('Price is required'),
        stock: yup.number().min(1, 'Stock must be greater than 0').required('Stock is required'),
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        let description= {
            labels: labels,
            connections: [],
        };
        try {
            const formDataForNew = new FormData();
            formDataForNew.set('name', values.name);
            formDataForNew.set('description', JSON.stringify(description));
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
            if (error.response.data.message === 'The image failed to upload.') {
                setServerError('The image failed to upload. The maximum file size is 2MB, and only jpeg, png, jpg, gif, svg, webp formats are supported.');
            } else {
                setServerError(error.response.data.message);
            }
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                if (document.startViewTransition) {
                    document.startViewTransition(() => {
                        navigate('/buy', {replace: true});
                    });
                } else {
                    navigate('/buy', {replace: true});
                }
            }
        }
    }

    return (
        <EditContainer
            padding="$3"
            marginBottom="5rem"
            width={screenSize > 1280 ? '50%' : screenSize > 768 ? '75%' : '100%'}
        >
            <HorizontalContainer marginTop="3rem" alignItems="center" justifyContent="space-between">
                <H2 marginBottom="1rem">New item</H2>
                <Square animation="quick" pressStyle={{scale: 0.8}} hoverStyle={{scale: 1.2}}
                        onClick={() => {document.startViewTransition ? document.startViewTransition(() => navigate('/buy', {replace: true})) : navigate('/buy', {replace: true})}}
                >
                    <X color="#292023" size={50} />
                </Square>
            </HorizontalContainer>
            <Formik
                validationSchema={schema}
                initialValues={{
                    name: '',
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
                                    <H4>Name of the item</H4>
                                </Label>
                                <Input
                                    backgroundColor="none"
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
                            <Separator />
                            <VerticalContainer>
                                <Label htmlFor="labels">
                                    <H4>Labels of the item</H4>
                                </Label>
                                <Labels
                                    id="labels"
                                    value={labels}
                                    onChange={setLabels}
                                />
                            </VerticalContainer>
                            <Separator />
                            <VerticalContainer>
                                <Label htmlFor="price">
                                    <H4>Price of the item</H4>
                                </Label>
                                <HorizontalContainer alignItems="center" justifyContent="space-between">
                                    {before &&
                                        <H6>{sign}</H6>
                                    }
                                    <Input
                                        backgroundColor="none"
                                        flex={1}
                                        borderWidth={2}
                                        type="number"
                                        id="price"
                                        min={0}
                                        value={values.price}
                                        onChange={handleChange}
                                        isInvalid={!!errors.price}
                                    />
                                    {!before &&
                                        <H6>{sign}</H6>
                                    }
                                </HorizontalContainer>
                                <SizableText size='small' color='red'>
                                    {errors.price}
                                </SizableText>
                            </VerticalContainer>
                            <Separator />
                            <VerticalContainer>
                                <Label htmlFor="stock">
                                    <H4>Stock of the item</H4>
                                </Label>
                                <Input
                                    backgroundColor="none"
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
                            <Separator />
                            <VerticalContainer>
                                <Label htmlFor='image'>
                                    <H4>Image of the item</H4>
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
                            <Separator />
                            <Form.Trigger asChild>
                                <BigButton icon={Save} type="submit">{isLoading ? <Spinner color="#FBF9EF" /> : 'Add new Item'}</BigButton>
                            </Form.Trigger>
                            {serverError && <SizableText color='red' >{serverError}</SizableText>}
                        </VerticalContainer>
                    </Form>
                )}
            </Formik>
        </EditContainer>
    )
}

export default React.memo(NewItem);