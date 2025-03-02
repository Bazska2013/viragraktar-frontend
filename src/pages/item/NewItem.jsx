import {Formik} from "formik";
import {Button, Form, Spinner} from "react-bootstrap";
import * as yup from "yup";
import axios from "../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

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
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('stock', values.stock);
            if (image) {
                formData.append('image', image);
            }
            response = await axios.post('/api/item', formData);
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
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
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
            {({handleSubmit, handleChange, setFieldValue, values, errors}) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Label column="lg">
                        Name of the item
                    </Form.Label>
                    <Form.Group controlId="name">
                        <Form.Control
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label column="lg">
                            Description of the item
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label column="lg">
                            Price of the item
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            min={0}
                            value={values.price}
                            onChange={handleChange}
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.price}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="stock">
                        <Form.Label column="lg">
                            Stock of the item
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            min={1}
                            value={values.stock}
                            onChange={handleChange}
                            isInvalid={!!errors.stock}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.stock}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="image">
                        <Form.Label column="lg">
                            Image of the item
                        </Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            accept='image/*'
                            onChange={(event) => {
                                setFieldValue('image', event.currentTarget.files[0]);
                                setImage(event.currentTarget.files[0]);
                            }}
                        />
                    </Form.Group>
                    <Button type="submit">Add new Item</Button>
                    {serverError && <p>{serverError}</p>}
                </Form>
            )}
        </Formik>
    )
}

export default NewItem;