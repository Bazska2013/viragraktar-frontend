import {useEffect, useState} from "react";
import axios from '../../axiosConfig.js';
import ListItem from "../../components/item/sell/ListItem.jsx";
import Cart from "../../components/item/sell/Cart.jsx";
import {SizableText, Spinner, AnimatePresence, Sheet, H2} from "tamagui";
import {BigButton, HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import {ShoppingBasket} from "@tamagui/lucide-icons";

const Sell = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);

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
        setShow(false);
    }

    const editCart = (item) => {
        setCart(cart.map((i) => i.id === item.id ? item : i));
    }

    const isItemInCart = (item) => {
        return cart.some((i) => i.id === item.id);
    }

    return (
        <VerticalContainer width="95%" alignSelf="center">
            <H2 marginLeft={10} marginRight={10}>Sell</H2>
            <AnimatePresence>
                {(cart.length > 0) &&
                    <BigButton position="fixed"
                               zIndex={1000}
                               bottom={10}
                               right={10}
                               animation="quick"
                               enterStyle={{
                                   x: 300,
                               }}
                               exitStyle={{
                                   x: 300,
                               }}
                               icon={ShoppingBasket} onClick={() => setShow(true)}>Checkout</BigButton>
                }
            </AnimatePresence>
            <Sheet
                modal={true}
                open={show}
                onOpenChange={setShow}
                snapPoints={[95]}
                snapPointsMode='percent'
                dismissOnSnapToBottom
                position={0}
                zIndex={100_000}
                animation='medium'
            >
                <Cart cart={cart} removeFromCart={removeFromCart} editCart={editCart} fetchItems={fetchItems} emptyCart={emptyCart} />
            </Sheet>
            {isLoading ?
                <Spinner alignSelf="center">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <HorizontalContainer flexWrap="wrap" marginLeft={10} marginRight={10}>
                        {items.map((item) => {
                            return (
                                <ListItem key={item.id} item={item} addToCart={addToCart} isItemInCart={isItemInCart(item)} editCart={editCart} removeFromCart={removeFromCart} />
                            )
                        })}
                    </HorizontalContainer>
            }
        </VerticalContainer>
    )
}

export default Sell;