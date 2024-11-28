import {useEffect, useState} from "react";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";

const Item = ({props}) => {
    const [item, setItem] = useState(props);
    const [isChanged, setIsChanged] = useState(false);
    const [amount, setAmount] = useState(0);

    const handleChange = (e, type) => {
        switch (type) {
            case 'add':
                if (amount < item.stock) {
                    setAmount(amount + 1);
                }
                break;
            case 'remove':
                if (amount > 0) {
                    setAmount(amount - 1);
                }
                break;
            case 'field':
                setAmount(e.target.name === 'stock' ? Number(e.target.value) : e.target.value);
                break;
        }
    };

    useEffect(() => {
        if (amount > 0) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [amount]);

    const handleSubmit = () => {
        setItem({...item, stock: item.stock - amount});
        setAmount(0);
    }

    return (
        <Container>
            <Row>
                <h1>{item.name}</h1>
            </Row>
            <Row>
                <Col>
                    <p>Price: {item.price}</p>
                </Col>
                <Col>
                    <p>Stock: {item.stock}</p>
                </Col>
            </Row>
            <Row>
                <InputGroup>
                    {(amount > 0) ? <>
                        <Button onClick={(e) => handleChange(e, 'remove')}>-</Button>
                    </> : <></>}
                    <Form.Control
                        type='number'
                        name='stock'
                        value={amount}
                        max={item.stock}
                        min={0}
                        onChange={(e) => handleChange(e, 'field')}
                        isInvalid={amount > item.stock || amount < 0}
                    />
                    <Form.Control.Feedback type="invalid">
                        {amount > item.stock ? 'Amount exceeds stock' : 'Amount cannot be negative'}
                    </Form.Control.Feedback>
                    <Button onClick={(e) => handleChange(e, 'add')}>+</Button>
                </InputGroup>
            </Row>
            <Row>
                <Col>
                    <Button>Details</Button>
                </Col>
                {isChanged ? <>
                    <Col>
                        <Button onClick={() => handleSubmit()}>Add to basket</Button>
                    </Col>
                </> : <></>}
            </Row>
        </Container>
    )
}

export default Item;