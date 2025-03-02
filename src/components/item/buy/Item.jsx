import {Button, Col, Container, InputGroup, Row, Form, Spinner, Image} from "react-bootstrap";
import {useState} from "react";
import axios from "../../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import flowerImage from "../../../assets/defaultFlower.svg";

const Item = ({props, refetch}) => {

    const [item, setItem] = useState(props);
    const navigate = useNavigate();
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/item/' + item.id, item);
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItem(response.data);
                setIsChanged(false);
                refetch();
            }
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

    if (isLoading) {
        return (
            <Spinner animation='border' role='status'>
                <span className='sr-only'>Loading...</span>
            </Spinner>
        )
    }

    if (error) {
        return (
            <p>{error}</p>
        )
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
                    <p>{item.image}</p>
                    <Image src={item.image ? "http://localhost:8000/images/" + item.image : flowerImage} rounded fluid />
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