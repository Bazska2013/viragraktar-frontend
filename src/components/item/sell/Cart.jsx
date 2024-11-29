import {Button, Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import CartItem from "./CartItem.jsx";
import {useNavigate} from "react-router-dom";

const Cart = ({cart, removeFromCart, editCart}) => {
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let total = 0;
        cart.forEach((item) => {
            total += item.price * item.amount;
        });
        setTotal(total);
    }, [cart]);

    return (
        <>
            {cart.map((item) => (
                <CartItem key={item.id} item={item} removeFromCart={removeFromCart} editCart={editCart} />
            ))}
            <Row>
                <Col>
                    Total: {total}
                </Col>
                <Col>
                    <Button onClick={() => navigate('/checkout', {state: {cart}})}>Checkout</Button>
                </Col>
            </Row>
        </>
    )
}

export default Cart;