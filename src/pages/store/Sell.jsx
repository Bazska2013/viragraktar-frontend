import React, {useEffect, useState} from "react";
import axios from '../../axiosConfig.js';
import ListItem from "../../components/item/sell/ListItem.jsx";
import Cart from "../../components/item/sell/Cart.jsx";
import {SizableText, Spinner, AnimatePresence, Sheet, H2} from "tamagui";
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {Delete, ShoppingBasket} from "@tamagui/lucide-icons";
import FilterBar from "../../components/item/FilterBar.jsx";

const Sell = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [isCartEmpty, setIsCartEmpty] = useState(true);

    const [filteredItems, setFilteredItems] = useState([]);
    const [filterString, setFilterString] = useState('');
    const [filterLabels, setFilterLabels] = useState([]);

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
        fetchItems().then((response) => {
            setFilteredItems(items);
            setFilterString('');
            setFilterLabels([]);
        });
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            setIsCartEmpty(false);
        } else {
            setIsCartEmpty(true);
        }
    }, [cart]);

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

    useEffect(() => {
        if (filterString.length > 0) {
            setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(filterString.toLowerCase())));
        } else {
            setFilteredItems(items);
        }
    }, [filterString]);

    useEffect(() => {
        if (filterLabels.length > 0) {
            setFilteredItems(items.filter((item) => JSON.parse(item.description).labels.some(label => filterLabels.includes(label))));
        } else {
            setFilteredItems(items);
        }
    }, [filterLabels]);

    return (
        <VerticalContainer width="95%" alignSelf="center">
            <FilterBar title="Sell" onTextChange={setFilterString} onLabelChange={setFilterLabels} />
            <BigButton position="fixed"
                       zIndex={1000}
                       bottom={10}
                       right={10}
                       animation="quick"
                       x={isCartEmpty ? 300 : 0}
                       icon={ShoppingBasket} onClick={() => setShow(true)}>Checkout</BigButton>
            <SmallButtonWithAccent
                position="fixed"
                zIndex={1000}
                bottom={90}
                right={10}
                animation="medium"
                x={isCartEmpty ? 200 : 0}
                icon={Delete}
                onClick={() => emptyCart()}
            >
                Empty cart
            </SmallButtonWithAccent>
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
                <Cart cart={cart} removeFromCart={removeFromCart} editCart={editCart} fetchItems={fetchItems} emptyCart={emptyCart} onOpenChange={setShow} />
            </Sheet>
            {isLoading ?
                <Spinner alignSelf="center" size="large" opacity={isLoading ? 1 : 0} animation="slowest">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <HorizontalContainer flexWrap="wrap" marginLeft={10} marginRight={10} marginBottom="5rem" opacity={isLoading ? 0 : 1} animation="slow">
                        {filteredItems.map((item) => {
                            return (
                                <ListItem key={item.id} item={item} addToCart={addToCart} isItemInCart={isItemInCart(item)} editCart={editCart} removeFromCart={removeFromCart} />
                            )
                        })}
                    </HorizontalContainer>
            }
        </VerticalContainer>
    )
}

export default React.memo(Sell);