import {useEffect, useState} from "react";
import {Group, H4, Image, Input, SizableText, XStack, YStack, Button} from "tamagui";
import flowerImage from "../../../assets/defaultFlower.svg";
import {FileSearch, Minus, Plus, ShoppingCart, X} from "@tamagui/lucide-icons";

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
        <XStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$2"
            padding="$2"
            justifyContent="center"
        >
            <YStack
                flex={1}
                borderWidth={2}
                borderColor="$color"
                borderRadius="$4"
                gap="$2"
                padding="$2"
                justifyContent="center"
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
            </YStack>
            <YStack
                flex={1}
                borderWidth={2}
                borderColor="$color"
                borderRadius="$4"
                gap="$2"
                padding="$2"
                justifyContent="center"
                width={screenSize > 1280 ? "150px" : (screenSize > 768 ? "125px" : "100%")}
            >
                <Group orientation='vertical'>
                    <Button icon={Plus} variant="outlined" size="$3" name="plus" onClick={(e) => handleChange(e, 'plus')} />
                    <Input
                        flex={1}
                        size="$3"
                        borderWidth={2}
                        type="number"
                        name="amount"
                        min={0}
                        max={item.stock}
                        value={amount}
                        onChange={(e) => handleChange(e, '')}
                    />
                    <Button icon={Minus} variant="outlined" size="$3" disabled={!isChanged} chromeless={!isChanged} name="minus" onClick={(e) => handleChange(e, 'minus')} />
                </Group>
                <Button icon={FileSearch} size="$3">View details</Button>
                <Button icon={ShoppingCart} size="$3" theme="accent" disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onClick={() => handleAddToCart()}>Add to cart</Button>
                <Button icon={X} disabled={!isChanged} chromeless={!isChanged} onClick={() => setAmount(0)} />
            </YStack>
        </XStack>
    )
}

export default ListItem;