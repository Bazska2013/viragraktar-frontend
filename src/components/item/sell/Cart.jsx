import {useEffect, useState} from "react";
import axios from "../../../axiosConfig.js";
import {H3, Spinner, Sheet, H2, Group, SizableText} from "tamagui";
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
            <Sheet.Frame justifyContent="center" alignItems="center">
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
                                    <SmallButton icon={Banknote} onClick={() => setCash(!cash)}>Cash</SmallButton>
                                    <SmallButton icon={CreditCard} onClick={() => setCash(!cash)}>Credit</SmallButton>
                                </Group>
                                <H3>
                                    Total: {total} HUF
                                </H3>
                                <BigButton icon={DollarSign} onClick={() => handleCheckout()}>Sell</BigButton>
                            </HorizontalContainer>
                            {error && <SizableText color='red' >{error}</SizableText>}
                        </VerticalContainer>
                    }
                </VerticalContainer>
            </Sheet.Frame>
        </>
    )
}

export default Cart;