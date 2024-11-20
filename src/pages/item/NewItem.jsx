import {Formik} from "formik";
import {Form} from "react-bootstrap";

const NewItem = () => {

    return (
        <Formik
            validationSchema={schema}
            initialValues={{

            }}
            onSubmit={(values) => handleSubmit(values)}
        >
            {({handleSubmit, handleChange, values, errors}) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder=""
                            value={values.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback>
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            )}
        </Formik>
    )
}

export default NewItem;