import {useEffect, useState} from "react";
import axios from '../../axiosConfig.js';
import {Row} from "react-bootstrap";
import ListItem from "../../components/item/sell/ListItem.jsx";
import Cart from "../../components/item/sell/Cart.jsx";

const Sell = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);

    const fetchItems = async () => {
        try {
            await axios.get('sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.get('/api/items', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                setItems(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    const addToCart = (item) => {
        setCart([...cart, item]);
    }

    const removeFromCart = (item) => {
        setCart(cart.filter((i) => i.id !== item.id));
    }

    const emptyCart = () => {
        setCart([]);
    }

    const editCart = (item) => {
        setCart(cart.map((i) => i.id === item.id ? item : i));
    }

    const isItemInCart = (item) => {
        return cart.some((i) => i.id === item.id);
    }

    return (
        <>
            {(cart.length > 0) ? <Row>
                <Cart cart={cart} removeFromCart={removeFromCart} editCart={editCart} fetchItems={fetchItems} emptyCart={emptyCart} />
            </Row> : <></>}
            {items.map((item) => (
                <Row key={item.id}>
                    {isItemInCart(item) ? <></> : <>
                        <ListItem item={item} addToCart={addToCart} />
                    </>}
                </Row>
            ))}
        </>
    )
}

export default Sell;