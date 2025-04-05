import {useEffect, useState} from "react";
import axios from "../../../axiosConfig.js";
import {H3, Spinner, Sheet, H2, Group, SizableText, H4, Separator, H6, SheetScrollView} from "tamagui";
import {Banknote, CreditCard, DollarSign} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, SmallButton, VerticalContainer} from "../../../tamagui.config.ts";

const Cart = ({cart, removeFromCart, editCart, fetchItems, emptyCart}) => {
    const [total, setTotal] = useState(0);
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
                setTotal(0);
                emptyCart();
                fetchItems();
            }
        }
    }

    return (
        <>
            <Sheet.Overlay
                animation='lazy'
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle />
            <Sheet.Frame alignItems="center">
                <VerticalContainer
                    padding="$3"
                    width="95%"
                >
                    <SheetScrollView>
                        <H2 marginTop="3rem" marginBottom="1rem">Checkout</H2>
                        <SizableText marginBottom="1rem">Swipe down to change the selected items</SizableText>
                        {isLoading ?
                            <Spinner>
                                <span className="sr-only">Loading...</span>
                            </Spinner> :
                            <VerticalContainer justifyContent="center">
                                <Separator />
                                <HorizontalContainer alignItems="center">
                                    <H6 width="10%" textAlign="center">#</H6>
                                    <H6 width="20%" textAlign="center">Name</H6>
                                    <H6 width="25%" textAlign="center">Amount</H6>
                                    <H6 width="15%" textAlign="center">Price</H6>
                                    <H6 width="20%" textAlign="center">Total</H6>
                                </HorizontalContainer>
                                <Separator />
                                {cart.map((item, index) => (
                                    <HorizontalContainer key={index} alignItems="center">
                                        <SizableText width="10%" textAlign="center">{index + 1}</SizableText>
                                        <SizableText width="20%" textAlign="center">{item.name}</SizableText>
                                        <SizableText width="25%" textAlign="center">{item.amount}</SizableText>
                                        <SizableText width="15%" textAlign="center">{item.price}</SizableText>
                                        <SizableText width="20%" textAlign="center">{item.price * item.amount}</SizableText>
                                    </HorizontalContainer>
                                ))}
                                <Separator />
                                <HorizontalContainer alignItems="center" justifyContent="space-between">
                                    <SizableText>Choose payment type</SizableText>
                                    <Group orientation='horizontal' alignItems="center" elevation={100}>
                                        <SmallButton icon={Banknote} onClick={() => setCash(!cash)}>Cash</SmallButton>
                                        <SmallButton icon={CreditCard} onClick={() => setCash(!cash)}>Credit</SmallButton>
                                    </Group>
                                </HorizontalContainer>
                                <Separator />
                                <HorizontalContainer alignItems="center" justifyContent="space-between" marginBottom="3rem">
                                    <H4>
                                        Total: {total} HUF
                                    </H4>
                                    <BigButton elevation={100} icon={DollarSign} onClick={() => handleCheckout()}>Sell</BigButton>
                                </HorizontalContainer>
                                {error && <SizableText color='red' >{error}</SizableText>}
                            </VerticalContainer>
                        }
                    </SheetScrollView>
                </VerticalContainer>
            </Sheet.Frame>
        </>
    )
}

export default Cart;