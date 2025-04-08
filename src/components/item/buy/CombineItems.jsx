import {
    Form,
    H2,
    H4, Image,
    Input,
    Label,
    Separator,
    Sheet,
    SheetScrollView,
    SizableText,
    Spinner,
    Square,
    TextArea
} from 'tamagui'
import {
    BigButton,
    EditContainer,
    HorizontalContainer,
    SmallButton,
    VerticalContainer
} from "../../../tamagui.config.ts";
import {Save, Upload, X} from "@tamagui/lucide-icons";
import {useEffect, useState} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import axios from "../../../axiosConfig.js";

const CombineItems = ({items, closeModal, refetchItems, emptySelection}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [image, setImage] = useState(null);

    const [combinedName, setCombinedName] = useState('');
    const [combinedDescription, setCombinedDescription] = useState('');
    const [combinedPrice, setCombinedPrice] = useState(0);
    const [combinedStock, setCombinedStock] = useState(1);

    useEffect(() => {
        if (items) {
            setCombinedName(items.map((item) => item.name).join('-'));
            setCombinedDescription(items.map((item) => item.description).join('-'));
            setCombinedPrice(items.map((item) => item.price).reduce((a, b) => a + b, 0));
        }
    }, [items]);

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
                emptySelection([]);
                refetchItems();
                closeModal(false);
            }
        }
    }

    return (
        <>
            <Sheet.Overlay
                animation='lazy'
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle />
            <Sheet.Frame alignItems="center">
                <VerticalContainer
                    padding="$3"
                    width="95%"
                >
                    <SheetScrollView>
                        <HorizontalContainer alignItems="center" justifyContent="space-between">
                            <H2 marginTop="3rem" marginBottom="1rem">Combine selected items</H2>
                            <Square animation="quick" pressStyle={{scale: 0.8}} hoverStyle={{scale: 1.2}} alignSelf="flex-end" marginBottom={0} onClick={() => closeModal(false)}>
                                <X color="#292023" size="$3" />
                            </Square>
                        </HorizontalContainer>
                        <SizableText marginBottom="1rem">Swipe down to change the selected items</SizableText>
                        {isLoading ?
                            <Spinner>
                                <span className="sr-only">Loading...</span>
                            </Spinner> :
                                <Formik
                                    enableReinitialize
                                    validationSchema={schema}
                                    initialValues={{
                                        name: combinedName || '',
                                        description: combinedDescription || '',
                                        price: combinedPrice || 0,
                                        stock: combinedStock || 1,
                                    }}
                                    onSubmit={(values) => handleSubmit(values)}
                                >
                                    {({handleSubmit: formikSubmit, handleChange, values, errors}) => (
                                        <Form noValidate onSubmit={formikSubmit}>
                                            <VerticalContainer>
                                                <VerticalContainer>
                                                    <Label htmlFor="name">
                                                        <H4>Name of the combined item</H4>
                                                    </Label>
                                                    <Input
                                                        backgroundColor="none"
                                                        flex={1}
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
                                                <Separator />
                                                <VerticalContainer>
                                                    <Label htmlFor="description">
                                                        <H4>Description of the combined item</H4>
                                                    </Label>
                                                    <TextArea
                                                        backgroundColor="none"
                                                        flex={1}
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
                                                <Separator />
                                                <VerticalContainer>
                                                    <Label htmlFor="price">
                                                        <H4>Price of the combined item</H4>
                                                    </Label>
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
                                                    <SizableText size='small' color='red'>
                                                        {errors.price}
                                                    </SizableText>
                                                </VerticalContainer>
                                                <Separator />
                                                <VerticalContainer>
                                                    <Label htmlFor="stock">
                                                        <H4>Stock of the combined item</H4>
                                                    </Label>
                                                    <Input
                                                        backgroundColor="none"
                                                        flex={1}
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
                                                <Separator />
                                                <VerticalContainer>
                                                    <Label htmlFor='image'>
                                                        <H4>Image of the combined item</H4>
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
                                                    <BigButton icon={Save} type='submit'>Save combined item</BigButton>
                                                </Form.Trigger>
                                                {serverError && <SizableText color="red">{serverError}</SizableText>}
                                            </VerticalContainer>
                                        </Form>
                                    )}
                                </Formik>
                        }
                    </SheetScrollView>
                </VerticalContainer>
            </Sheet.Frame>
        </>
    )
}

export default CombineItems;