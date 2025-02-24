import {Button, Col, Modal, Row, Spinner, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import CartItem from "./CartItem.jsx";
import axios from "../../../axiosConfig.js";

const Cart = ({cart, removeFromCart, editCart, fetchItems, emptyCart}) => {
    const [total, setTotal] = useState(0);
    const [show, setShow] = useState(false);
    const [cash, setCash] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let total = 0;
        cart.forEach((item) => {
            total += item.price * item.amount;
        });
        setTotal(total);
    }, [cart]);

    const handleCheckout = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/new/transaction', {
                items: cart,
                total: total,
                credit: !cash,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                setShow(false);
                setTotal(0);
                emptyCart();
                fetchItems();
            }
        }
    }

    return (
        <>
            <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? <>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </> : <>
                        <Row>
                            <Table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.price}</td>
                                        <td>{item.price * item.amount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Row>
                        <Row>
                            <Col>
                                {cash ? <>
                                    <Button variant="primary" onClick={() => setCash(!cash)}>Cash</Button>
                                    <Button variant="secondary" onClick={() => setCash(!cash)}>Card</Button>
                                </> : <>
                                    <Button variant="secondary" onClick={() => setCash(!cash)}>Cash</Button>
                                    <Button variant="primary" onClick={() => setCash(!cash)}>Card</Button>
                                </>}
                            </Col>
                            <Col>
                                Total: {total} HUF
                            </Col>
                            <Col>
                                <Button onClick={() => handleCheckout()} variant="success">Sell</Button>
                            </Col>
                        </Row>
                        {error && <p>{error}</p>}
                    </>}
                </Modal.Body>
            </Modal>
            {cart.map((item) => (
                <CartItem key={item.id} item={item} removeFromCart={removeFromCart} editCart={editCart} />
            ))}
            <Row style={{borderBottom: "1px solid black"}}>
                <Col>
                    Total: {total}
                </Col>
                <Col>
                    <Button onClick={() => setShow(true)}>Checkout</Button>
                </Col>
            </Row>
        </>
    )
}

export default Cart;