import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {useEffect, useState} from "react";

const CartItem = ({item, removeFromCart, editCart}) => {
    const [amount, setAmount] = useState(item.amount);

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
    }

    useEffect(() => {
        if (amount === 0) {
            removeFromCart(item);
        } else {
            editCart({...item, amount: amount});
        }
    }, [amount]);

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
                <Col>
                    Total: {item.price * item.amount}
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup>
                        <Button name="minus" onClick={(e) => handleChange(e)}>-</Button>
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
                </Col>
                <Col>
                    <Button onClick={() => removeFromCart(item)}>Remove</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default CartItem;