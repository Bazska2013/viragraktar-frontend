import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {Formik} from "formik";
import {Button, Form} from "react-bootstrap";
import * as yup from "yup";

const EditItem = () => {
    const [item, setItem] = useState({});
    const id = useParams().id;

    const fetchItem = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.get('/api/item/' + id, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                setItem(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        description: yup.string().required('Description is required'),
        price: yup.number().min(0, 'Price must be greater than or equal 0').required('Price is required'),
        stock: yup.number().min(0, 'Stock must be greater than or equal 0').required('Stock is required'),
        /*image: yup.mixed().required('Image is required')*/
    });

    const handleSubmit = async (values) => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.put('/api/item/' + item.id, {
                name: values.name,
                description: values.description,
                price: values.price,
                stock: values.stock,
                /*image: values.image*/
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                navigate('/buy', {replace: true});
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchItem();
    }, []);

    return (
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
            {({handleSubmit, handleChange, values, errors}) => (
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
                            min={0}
                            value={values.stock}
                            onChange={handleChange}
                            isInvalid={!!errors.stock}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.stock}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/*<Form.Group controlId="image">
                        <Form.Label column="lg">
                            Image of the item
                        </Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            value={values.image}
                            onChange={handleChange}
                            isInvalid={!!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.image}
                        </Form.Control.Feedback>
                    </Form.Group>*/}
                    <Button type="submit">Confirm changes</Button>
                </Form>
            )}
        </Formik>
    )
}

export default EditItem;