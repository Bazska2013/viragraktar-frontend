import {Col, Modal, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import CartItem from "./CartItem.jsx";
import axios from "../../../axiosConfig.js";
import {H3, XStack, YStack, Button, Spinner, Sheet, H2, Group, SizableText} from "tamagui";
import {Banknote, CreditCard, DollarSign, Trash} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, SmallButton, VerticalContainer} from "../../../tamagui.config.ts";

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
                <Sheet.Overlay
                    animation='lazy'
                    backgroundColor="$shadow6"
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                />
                <Sheet.Handle />
                <Sheet.Frame /*padding="$4"*/ justifyContent="center" alignItems="center" /*gap="$5"*/>
                    <VerticalContainer>
                        <H2>Checkout</H2>
                        {isLoading ?
                            <Spinner>
                                <span className="sr-only">Loading...</span>
                            </Spinner> :
                            <VerticalContainer>
                                <HorizontalContainer>
                                    <H3>#</H3>
                                    <H3>Name</H3>
                                    <H3>Amount</H3>
                                    <H3>Price</H3>
                                    <H3>Total</H3>
                                </HorizontalContainer>
                                {cart.map((item, index) => (
                                    <HorizontalContainer key={index}>
                                        <SizableText>{index + 1}</SizableText>
                                        <SizableText>{item.name}</SizableText>
                                        <SizableText>{item.amount}</SizableText>
                                        <SizableText>{item.price}</SizableText>
                                        <SizableText>{item.price * item.amount}</SizableText>
                                    </HorizontalContainer>
                                ))}
                                <HorizontalContainer>
                                    <Group orientation='horizontal'>
                                        <SmallButton icon={Banknote} variant="primary" onClick={() => setCash(!cash)}>Cash</SmallButton>
                                        <SmallButton icon={CreditCard} variant="secondary" onClick={() => setCash(!cash)}>Credit</SmallButton>
                                    </Group>
                                    <H3>
                                        Total: {total} HUF
                                    </H3>
                                    <BigButton icon={DollarSign} onClick={() => handleCheckout()} variant="success">Sell</BigButton>
                                </HorizontalContainer>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </VerticalContainer>
                        }
                    </VerticalContainer>
                </Sheet.Frame>
            </Sheet>
            <VerticalContainer>
                {cart.map((item) => (
                    <CartItem key={item.id} item={item} removeFromCart={removeFromCart} editCart={editCart} />
                ))}
                <HorizontalContainer>
                    <H3>Total: {total}</H3>
                    <BigButton icon={CreditCard} onClick={() => setShow(true)}>Checkout</BigButton>
                </HorizontalContainer>
            </VerticalContainer>
        </>
    )
}

export default Cart;