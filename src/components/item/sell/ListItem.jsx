import {useEffect, useState} from "react";
import {Group, H4, Image, Input, SizableText, XStack, YStack, Button} from "tamagui";
import flowerImage from "../../../assets/defaultFlower.svg";
import {FileSearch, Minus, Plus, ShoppingCart, X} from "@tamagui/lucide-icons";
import {VerticalContainer, HorizontalContainer, SmallButtonWithAccent, SmallButton} from "../../../tamagui.config.ts";

const ListItem = ({ item, addToCart }) => {
    const [amount, setAmount] = useState(0);
    const [isChanged, setIsChanged] = useState(false);

    const screenSize = window.innerWidth;

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
        }
    }, [amount]);

    const handleAddToCart = () => {
        let newItem = {...item, amount: amount};
        addToCart(newItem);
        setAmount(0);
    }

    return (
        <HorizontalContainer
            borderColor="#292023"
            borderWidth={2}
            borderRadius="$3"
            boxShadow="0 0 10px 0 rgba(0, 0, 0, 0.2)"
        >
            <VerticalContainer
                justifyContent="space-between"
                width={screenSize > 1280 ? "200px" : (screenSize > 768 ? "175px" : "100%")}
            >
                <Image source={{
                    uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                    width: 100,
                    height: 100,
                }} />
                <H4>{item.name}</H4>
                <SizableText>{item.price}</SizableText>
                <SizableText>{item.stock}</SizableText>
            </VerticalContainer>
            <VerticalContainer
                width={screenSize > 1280 ? "150px" : (screenSize > 768 ? "125px" : "100%")}
            >
                <Group orientation='vertical'>
                    <SmallButtonWithAccent icon={Plus} name="plus" onClick={(e) => handleChange(e, 'plus')} />
                    <Input
                        flex={1}
                        // size="$3"
                        borderWidth={2}
                        type="number"
                        name="amount"
                        min={0}
                        max={item.stock}
                        value={amount}
                        onChange={(e) => handleChange(e, '')}
                    />
                    <SmallButtonWithAccent icon={Minus} disabled={!isChanged} chromeless={!isChanged} name="minus" onClick={(e) => handleChange(e, 'minus')} />
                </Group>
                <SmallButton icon={FileSearch}>View details</SmallButton>
                <SmallButtonWithAccent icon={ShoppingCart} disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onClick={() => handleAddToCart()}>Add to cart</SmallButtonWithAccent>
                <SmallButton icon={X} disabled={!isChanged} chromeless={!isChanged} onClick={() => setAmount(0)} />
            </VerticalContainer>
        </HorizontalContainer>
    )
}

export default ListItem;