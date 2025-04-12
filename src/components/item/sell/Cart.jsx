import React, {useEffect, useState} from "react";
import axios from "../../../axiosConfig.js";
import {H3, Spinner, Sheet, H2, Group, SizableText, H4, Separator, H6, SheetScrollView, Square} from "tamagui";
import {Banknote, CreditCard, DollarSign, X} from "@tamagui/lucide-icons";
import {BigButton, HorizontalContainer, SmallButton, StyledGroup, VerticalContainer} from "../../../tamagui.config.ts";

const Cart = ({cart, removeFromCart, editCart, fetchItems, emptyCart, onOpenChange, sign, before}) => {
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
                        <HorizontalContainer alignItems="center" justifyContent="space-between">
                            <H2 marginTop="3rem" marginBottom="1rem">Checkout</H2>
                            <Square animation="quick" pressStyle={{scale: 0.8}} hoverStyle={{scale: 1.2}} alignSelf="flex-end" marginBottom={0} onClick={() => onOpenChange(false)}>
                                <X color="#292023" size="$3" />
                            </Square>
                        </HorizontalContainer>
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
                                    <HorizontalContainer key={item.id} alignItems="center">
                                        <SizableText width="10%" textAlign="center">{index + 1}</SizableText>
                                        <SizableText width="20%" textAlign="center">{item.name}</SizableText>
                                        <SizableText width="25%" textAlign="center">{item.amount}</SizableText>
                                        <SizableText width="15%" textAlign="center">{before ? sign + item.price : item.price + " " + sign}</SizableText>
                                        <SizableText width="20%" textAlign="center">{before ? sign + item.price * item.amount : item.price * item.amount + " " + sign}</SizableText>
                                    </HorizontalContainer>
                                ))}
                                <Separator />
                                <HorizontalContainer alignItems="center" justifyContent="space-between">
                                    <SizableText>Choose payment type</SizableText>
                                    <StyledGroup orientation='horizontal' alignItems="center">
                                        <SmallButton boxShadow="unset" icon={Banknote} onClick={() => setCash(!cash)}>Cash</SmallButton>
                                        <SmallButton boxShadow="unset" icon={CreditCard} onClick={() => setCash(!cash)}>Credit</SmallButton>
                                    </StyledGroup>
                                </HorizontalContainer>
                                <Separator />
                                <HorizontalContainer alignItems="center" justifyContent="space-between" marginBottom="3rem">
                                    <H4>
                                        Total: {before ? sign + total : total + " " + sign}
                                    </H4>
                                    <BigButton icon={DollarSign} onClick={() => handleCheckout()}>Sell</BigButton>
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

export default React.memo(Cart);