import React, {useEffect, useState} from "react";
import axios from '../../axiosConfig.js';
import ListItem from "../../components/item/sell/ListItem.jsx";
import Cart from "../../components/item/sell/Cart.jsx";
import {SizableText, Spinner, Sheet, H2} from "tamagui";
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {Delete, ShoppingBasket} from "lucide-react";
import FilterBar from "../../components/item/FilterBar.jsx";
import {useSelector} from "react-redux";
import {selectStore} from "../../features/store/storeSlice.js";

const Sell = () => {
    const store = useSelector(selectStore);
    const [sign, setSign] = useState('');
    const [before, setBefore] = useState(false);

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
            if (response?.status === 200) {
                setItems(response.data);
                setFilteredItems(response.data);
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        setFilteredItems([]);
        fetchItems().then(() => {
            setFilterString('');
            setFilterLabels([]);
            setSign(JSON.parse(store.currency).sign);
            setBefore(JSON.parse(store.currency).before);
            if (items.length > 0) {
                setIsLoading(false);
            } else {
                const timeout = setTimeout(() => {
                    if (items.length === 0) {
                        setIsLoading(false);
                    }
                }, 5000);

                return () => clearTimeout(timeout);
            }
        });
    }, [filteredItems.length, store.currency]);

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
    }, [filterString, items]);

    useEffect(() => {
        if (filterLabels.length > 0) {
            setFilteredItems(items.filter((item) => JSON.parse(item.description).labels.some(label => filterLabels.includes(label))));
        } else {
            setFilteredItems(items);
        }
    }, [filterLabels, items]);

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
                <Cart cart={cart} removeFromCart={removeFromCart} editCart={editCart} fetchItems={fetchItems} emptyCart={emptyCart} onOpenChange={setShow} sign={sign} before={before} />
            </Sheet>
            {isLoading ?
                <Spinner color="#292023" alignSelf="center" size="large" opacity={isLoading ? 1 : 0} animation="slowest">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <HorizontalContainer flexWrap="wrap" marginLeft={10} marginRight={10} marginBottom="5rem" opacity={isLoading ? 0 : 1} animation="slow">
                        {filteredItems.length > 0 && filteredItems.map((item) => {
                            return (
                                <ListItem key={item.id} item={item} addToCart={addToCart} isItemInCart={isItemInCart(item)} editCart={editCart} removeFromCart={removeFromCart} sign={sign} before={before} />
                            )
                        })}
                        {filteredItems.length === 0 &&
                            <HorizontalContainer flex={1} justifyContent="center" alignItems="center">
                                <H2>No items found</H2>
                            </HorizontalContainer>
                        }
                    </HorizontalContainer>
            }
        </VerticalContainer>
    )
}

export default React.memo(Sell);