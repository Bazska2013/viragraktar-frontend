import {Button, Col, Container, InputGroup, Row, Form} from "react-bootstrap";
import {useState} from "react";
import axios from "../../../axiosConfig.js";
import {useNavigate} from "react-router-dom";

const Item = ({props}) => {

    const [item, setItem] = useState(props);
    const navigate = useNavigate();

    const handleChange = async (type) => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.put('/api/item', {
                id: item.id,
                stock: type === 'add' ? item.stock + 1 : item.stock - 1
            }, {
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

    return (
        <Container>
            <Row>
                <Col>
                    <h1>
                        {item.name}
                    </h1>
                </Col>
                <Col>
                    <p>{item.description}</p>
                    <p>{item.price}</p>
                </Col>
                <Col>
                    <InputGroup>
                        <Button onClick={() => {handleChange('remove')}}>
                            -
                        </Button>
                        <Form.Control
                            type='number'
                            value={item.stock}
                            readOnly
                        />
                        <Button onClick={() => {handleChange('add')}}>
                            +
                        </Button>
                    </InputGroup>
                    <Button onClick={() => navigate('edit/item/' + item.id, {replace:true})}>
                        Edit Item
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Item;