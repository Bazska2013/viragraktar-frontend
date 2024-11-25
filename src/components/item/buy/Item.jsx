import {Button, Col, Container, InputGroup, Row, Form} from "react-bootstrap";
import {useState} from "react";
import axios from "../../../axiosConfig.js";
import {useNavigate} from "react-router-dom";

const Item = ({props}) => {

    const [item, setItem] = useState(props);
    const navigate = useNavigate();
    const [isChanged, setIsChanged] = useState(false);

    const handleSubmit = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.put('/api/item/' + item.id, item, {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                setItem(response.data);
                setIsChanged(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e, type) => {
        switch (type) {
            case 'add':
                setItem({...item, stock: item.stock + 1});
                break;
            case 'remove':
                setItem({...item, stock: item.stock - 1});
                break;
            case 'field':
                setItem({...item, [e.target.name]: e.target.name === 'stock' ? Number(e.target.value) : e.target.value});
                break;
        }
        setIsChanged(true);
    }

    const handleCancel = () => {
        setItem(props);
        setIsChanged(false);
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
                        <Button onClick={(e) => {handleChange(e, 'remove')}}>
                            -
                        </Button>
                        <Form.Control
                            type='number'
                            name='stock'
                            value={item.stock}
                            onChange={(e) => handleChange(e, 'field')}
                        />
                        {isChanged ? <>
                            <Button onClick={() => handleSubmit()}>Save changes</Button>
                            <Button onClick={() => handleCancel()}>Cancel changes</Button>
                        </> : <></>}
                        <Button onClick={(e) => {handleChange(e, 'add')}}>
                            +
                        </Button>
                    </InputGroup>
                    <Button onClick={() => navigate('/edit/item/' + item.id, {replace:true})}>
                        Edit Item
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Item;