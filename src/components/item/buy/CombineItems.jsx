import {Form, H2, H4, H6, Input, Label, Separator, Sheet, SheetScrollView, SizableText, Spinner, Square} from 'tamagui'
import {BigButton, HorizontalContainer, SmallButton, VerticalContainer} from "../../../tamagui.config.ts";
import {Save, Upload, X} from "@tamagui/lucide-icons";
import React, {useEffect, useState} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import axios from "../../../axiosConfig.js";
import Labels from "./Labels.jsx";
import PropTypes from "prop-types";

const CombineItems = ({items, closeModal, refetchItems, emptySelection, before, sign}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [image, setImage] = useState(null);

    const [combinedName, setCombinedName] = useState('');
    const [combinedPrice, setCombinedPrice] = useState(0);
    const [combinedLabels, setCombinedLabels] = useState([]);

    useEffect(() => {
        setCombinedName(items.map((item) => item.name).join('-'));
        setCombinedPrice(items.map((item) => item.price).reduce((a, b) => a + b, 0));
        const newLabels = [];
        for (let item of items) {
            for (let label of JSON.parse(item.description).labels) {
                if (!newLabels.includes(label)) {
                    newLabels.push(label);
                }
            }
        }
        setCombinedLabels(newLabels);
    }, [items]);

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        price: yup.number().min(0, 'Price must be greater than or equal 0').required('Price is required'),
        stock: yup.number().min(0, 'Stock must be greater than or equal 0').required('Stock is required'),
    });

    const handleSubmit = async (values) => {
        let response;
        setIsLoading(true);
        let description = {
            labels: combinedLabels,
            connections: items,
        }
        try {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('description', JSON.stringify(description));
            formData.set('price', values.price);
            formData.set('stock', values.stock);
            if (image) {
                formData.set('image', image);
            }
            response = await axios.post('/api/item', formData, {
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
                            <Spinner color="#292023">
                                <span className="sr-only">Loading...</span>
                            </Spinner> :
                                <Formik
                                    enableReinitialize
                                    validationSchema={schema}
                                    initialValues={{
                                        name: combinedName || '',
                                        price: combinedPrice || 0,
                                        stock: 1,
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
                                                    <Label htmlFor="labels">
                                                        <H4>Labels of the item</H4>
                                                    </Label>
                                                    <Labels
                                                        id="labels"
                                                        value={combinedLabels}
                                                        onChange={setCombinedLabels}
                                                        combined
                                                    />
                                                </VerticalContainer>
                                                <Separator />
                                                <VerticalContainer>
                                                    <Label htmlFor="price">
                                                        <H4>Price of the combined item</H4>
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

CombineItems.propTypes = {
    items: PropTypes.array.isRequired,
    closeModal: PropTypes.func.isRequired,
    refetchItems: PropTypes.func.isRequired,
    emptySelection: PropTypes.func.isRequired,
    before: PropTypes.bool,
    sign: PropTypes.string,
}

export default React.memo(CombineItems);