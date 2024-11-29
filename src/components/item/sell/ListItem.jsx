import {Button, Col, Container, InputGroup, Row, Form} from "react-bootstrap";
import {useEffect, useState} from "react";

const ListItem = ({ item, addToCart }) => {
    const [amount, setAmount] = useState(0);
    const [isChanged, setIsChanged] = useState(false);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'minus':
                if (amount > 0) {
                    setAmount(amount - 1);
                }
                break;
            case 'plus':
                if (amount < item.stock) {
                    setAmount(amount + 1);
                }
                break;
            default: {
                const value = Number(e.target.value);
                if (value >= 0 && value <= item.stock) {
                    setAmount(value);
                }}
                break;
        }
        setIsChanged(true);
    }

    useEffect(() => {
        if (amount === 0) {
            setIsChanged(false);
        }
    }, [amount]);

    const handleAddToCart = () => {
        let newItem = {...item, amount: amount};
        addToCart(newItem);
        setAmount(0);
    }

    return (
        <Container>
            <Row>{item.name}</Row>
            <Row>
                <Col>
                    Price: {item.price}
                </Col>
                <Col>
                    Stock: {item.stock}
                </Col>
            </Row>
            <Row>
                <InputGroup>
                    {isChanged ? <>
                        <Button name="minus" onClick={(e) => handleChange(e)}>-</Button>
                    </> : <></>}
                    <Form.Control
                        type="number"
                        name="amount"
                        min={0}
                        max={item.stock}
                        value={amount}
                        onChange={(e) => handleChange(e)}
                    />
                    <Button name="plus" onClick={(e) => handleChange(e)}>+</Button>
                </InputGroup>
            </Row>
            <Row>
                <Col>
                    <Button>View details</Button>
                </Col>
                {isChanged ? <>
                    <Col>
                        <Button onClick={() => handleAddToCart()}>Add to cart</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => setAmount(0)}>Cancel</Button>
                    </Col>
                </> : <></>}
            </Row>
        </Container>
    )
}

export default ListItem;