import {useEffect, useState} from "react";
import axios from '../../axiosConfig.js';
import {Row, Spinner} from "react-bootstrap";
import ListItem from "../../components/item/sell/ListItem.jsx";
import Cart from "../../components/item/sell/Cart.jsx";
import {SizableText, XStack, YStack} from "tamagui";

const Sell = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/items');
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItems(response.data);
            }
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
        <YStack>
            {(cart.length > 0) &&
                <Cart cart={cart} removeFromCart={removeFromCart} editCart={editCart} fetchItems={fetchItems} emptyCart={emptyCart} />
            }
            {isLoading ?
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <XStack
                        flex={1}
                        flexWrap="wrap"
                        gap="$5"
                        $gtSm={{
                            flexDirection: 'column',
                            flexWrap: 'nowrap',
                        }}
                    >
                        {items.map((item) => (
                            <XStack key={item.id}>
                                {isItemInCart(item) ? <></> : <>
                                    <ListItem item={item} addToCart={addToCart} />
                                </>}
                            </XStack>
                        ))}
                    </XStack>
            }
        </YStack>
    )
}

export default Sell;