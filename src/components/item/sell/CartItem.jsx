import {useEffect, useState} from "react";
import {YStack, Button, XStack, Image, H4, SizableText, Group, Input} from "tamagui";
import flowerImage from "../../../assets/defaultFlower.svg";
import {Minus, Plus, Trash} from "@tamagui/lucide-icons";

const CartItem = ({item, removeFromCart, editCart}) => {
    const [amount, setAmount] = useState(item.amount);

    const screenSize = window.innerWidth;

    const handleChange = (e) => {
        switch (e.target.name) {
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
    }

    useEffect(() => {
        if (amount === 0) {
            removeFromCart(item);
        } else {
            editCart({...item, amount: amount});
        }
    }, [amount]);

    return (
        <>
            {screenSize > 768 ? <XStack
                flex={1}
                borderWidth={2}
                borderColor="$color"
                borderRadius="$4"
                gap="$2"
                padding="$2"
                justifyContent="space-between"
            >
                <Image source={{
                    uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                    width: 50,
                    height: 50,
                }} />
                <H4>{item.name}</H4>
                <SizableText>{item.price}</SizableText>
                <SizableText>{item.stock}</SizableText>
                <SizableText>Total: {item.price * item.amount}</SizableText>
                <Group orientation='horizontal'>
                    <Button icon={Minus} variant="outlined" size="$3" name="minus" onClick={(e) => handleChange(e)} />
                    <Input
                        flex={1}
                        size="$3"
                        borderWidth={2}
                        type="number"
                        name="amount"
                        min={0}
                        max={item.stock}
                        value={amount}
                        onChange={(e) => handleChange(e)}
                    />
                    <Button icon={Plus} variant="outlined" size="$3" name="plus" onClick={(e) => handleChange(e)} />
                </Group>
                <Button icon={Trash} size="$3" theme="accent" onClick={() => removeFromCart(item)}>Remove</Button>
            </XStack> : <YStack
                flex={1}
                borderWidth={2}
                borderColor="$color"
                borderRadius="$4"
                gap="$2"
                padding="$2"
                justifyContent="space-between"
            >
                <XStack
                    flex={1}
                    borderWidth={2}
                    borderColor="$color"
                    borderRadius="$4"
                    gap="$2"
                    padding="$2"
                    justifyContent="space-between"
                >
                    <Image source={{
                        uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                        width: 50,
                        height: 50,
                    }} />
                    <H4>{item.name}</H4>
                    <SizableText>{item.price}</SizableText>
                    <SizableText>{item.stock}</SizableText>
                    <SizableText>Total: {item.price * item.amount}</SizableText>
                </XStack>
                <XStack
                    flex={1}
                    borderWidth={2}
                    borderColor="$color"
                    borderRadius="$4"
                    gap="$2"
                    padding="$2"
                    justifyContent="space-between"
                >
                    <Group orientation='horizontal'>
                        <Button icon={Minus} variant="outlined" size="$3" name="minus" onClick={(e) => handleChange(e)} />
                        <Input
                            flex={1}
                            size="$3"
                            borderWidth={2}
                            type="number"
                            name="amount"
                            min={0}
                            max={item.stock}
                            value={amount}
                            onChange={(e) => handleChange(e)}
                        />
                        <Button icon={Plus} variant="outlined" size="$3" name="plus" onClick={(e) => handleChange(e)} />
                    </Group>
                    <Button icon={Trash} size="$3" theme="accent" onClick={() => removeFromCart(item)}>Remove</Button>
                </XStack>
            </YStack>}
        </>
    )
}

export default CartItem;