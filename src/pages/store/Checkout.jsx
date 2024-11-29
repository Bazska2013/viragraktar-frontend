import {Navigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {Container} from "react-bootstrap";

const Checkout = () => {
    const location = useLocation();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (location.state && location.state.cart) {
            setCart(location.state.cart);
        }
    }, [location.state]);

    if (cart.length === 0) {
        return (
            <Navigate to="/sell" replace={true} />
        )
    }

    return (
        <Container>
            {cart.map((item) => (
                <div key={item.id}>
                    {item.name} x {item.amount}
                </div>
            ))}
        </Container>
    )
}

export default Checkout;