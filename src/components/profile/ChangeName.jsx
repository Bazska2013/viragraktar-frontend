import {Button, Container, Form, Row} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";
import axios from "../../axiosConfig.js";
import {setUser} from "../../features/auth/userSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

const ChangeName = ({user}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
    });

    const handleSubmit = async (values) => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.post('/change-name', {
                name: values.name,
            }, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                dispatch(setUser(response.data));
                navigate('/edit/profile', {replace: true});
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            <Row>
                <h1>Change Name</h1>
            </Row>
            <Row>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        name: user.name,
                        email: user.email
                    }}
                    onSubmit={(values) => {handleSubmit(values)}}
                >
                    {({handleSubmit, handleChange, values, errors}) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label column="lg">Name</Form.Label>
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
                            <Form.Group controlId="email">
                                <Form.Label column="lg">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    disabled
                                />
                            </Form.Group>
                            <Button type="submit">
                                Change Name
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Row>
        </Container>
    );
}

export default ChangeName;