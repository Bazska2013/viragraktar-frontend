import {useEffect, useState} from "react";
import {Group, H4, Image, Input, SizableText, Button, Square} from "tamagui";
import flowerImage from "../../../assets/defaultFlower.svg";
import {FileSearch, Minus, Plus, ShoppingCart, X} from "@tamagui/lucide-icons";
import {
    VerticalContainer,
    HorizontalContainer,
    SmallButtonWithAccent,
    SmallButton,
    StyledGroup
} from "../../../tamagui.config.ts";

const ListItem = ({ item, addToCart, isItemInCart, editCart, removeFromCart }) => {
    const [amount, setAmount] = useState(0);
    const [isChanged, setIsChanged] = useState(false);
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleChange = (e, type) => {
        switch (type) {
            case 'minus':
                if (amount > 0) {
                    setAmount(amount - 1);
                }
                break;
            case 'plus':
                if (amount < item.stock) {
                    setAmount(amount + 1);
                }
                break;
            default: {
                const value = Number(e.target.value);
                if (value >= 0 && value <= item.stock) {
                    setAmount(value);
                }}
                break;
        }
        setIsChanged(true);
    }

    useEffect(() => {
        if (amount === 0) {
            setIsChanged(false);
            removeFromCart(item);
        } else {
            setIsChanged(true);
            editCart({...item, amount: amount});
        }
    }, [amount]);

    useEffect(() => {
        if (!isItemInCart) {
            setAmount(0);
        }
    }, [item, isItemInCart]);

    const handleAddToCart = () => {
        let newItem = {...item, amount: amount};
        addToCart(newItem);
    }

    if (item.stock === 0) {
        return (
            <></>
        )
    }

    return (
        <VerticalContainer
            borderRadius="$5"
            boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
            backgroundColor={isItemInCart ? 'rgba(251,249,239,0.9)' : ''}
            alignSelf="center"
            flex={1}
            padding="$3"
        >
            <Square animation="quick" hoverStyle={{scale: 1.1}} pressStyle={{scale: 0.9}} scale={isChanged ? 1 : 0} opacity={isChanged ? 1 : 0} alignSelf="flex-end" marginBottom={0} onClick={() => setAmount(0)}>
                <X color="#292023" size="$1" />
            </Square>
            <HorizontalContainer
                flex={1}
            >
                <VerticalContainer
                    flex={5}
                    alignItems="center"
                    width={screenSize > 1280 ? "200px" : (screenSize > 768 ? "175px" : "100%")}
                >
                    <Image onClick={(e) => handleChange(e, 'plus')} borderRadius="$5" boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)" source={{
                        uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                        width: 180,
                        height: 180,
                    }} />
                    <H4>{item.name}</H4>
                    <SizableText>Price: HUF {item.price}</SizableText>
                    <SizableText>Stock: {item.stock}</SizableText>
                </VerticalContainer>
                <VerticalContainer
                    flex={1}
                    width={screenSize > 1280 ? "120px" : (screenSize > 768 ? "110px" : "100px")}
                    alignItems="center"
                >
                    <StyledGroup orientation='vertical' width="100%">
                        <SmallButtonWithAccent icon={Plus} name="plus" onClick={(e) => handleChange(e, 'plus')} />
                        <Input
                            textAlign="center"
                            width="100%"
                            backgroundColor="white"
                            flex={1}
                            borderWidth={2}
                            type="number"
                            name="amount"
                            min={0}
                            max={item.stock}
                            value={amount}
                            onChange={(e) => handleChange(e, '')}
                        />
                        <SmallButtonWithAccent icon={Minus} disabled={!isChanged} chromeless={!isChanged} name="minus" onClick={(e) => handleChange(e, 'minus')} />
                    </StyledGroup>
                    <SmallButton width="100%" icon={FileSearch}>{screenSize > 768 ? 'View details' : ''}</SmallButton>
                    <SmallButtonWithAccent width="100%" icon={ShoppingCart} disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onClick={() => handleAddToCart()}>{screenSize > 768 ? 'Add to cart' : ''}</SmallButtonWithAccent>
                </VerticalContainer>
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default ListItem;