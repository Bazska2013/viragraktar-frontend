import {useEffect, useState} from "react";
import {Group, H4, Image, Input, SizableText, Button} from "tamagui";
import flowerImage from "../../../assets/defaultFlower.svg";
import {FileSearch, Minus, Plus, ShoppingCart, X} from "@tamagui/lucide-icons";
import {VerticalContainer, HorizontalContainer, SmallButtonWithAccent, SmallButton} from "../../../tamagui.config.ts";

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

    const handleAddToCart = () => {
        let newItem = {...item, amount: amount};
        addToCart(newItem);
    }

    return (
        <VerticalContainer
            borderRadius="$5"
            boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
            backgroundColor={isItemInCart ? '#f2f6d5' : ''}
            alignSelf="center"
            flex={1}
            padding="$3"
        >
            <Button
                boxShadow={isChanged ? "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)" : "none"}
                icon={X}
                disabled={!isChanged}
                backgroundColor={isChanged ? '#f2f6d5' : 'transparent'}
                alignSelf="flex-end"
                marginBottom={0}
                size="$3"
                onClick={() => setAmount(0)} />
            <HorizontalContainer
                flex={1}
            >
                <VerticalContainer
                    flex={5}
                    alignItems="center"
                    width={screenSize > 1280 ? "200px" : (screenSize > 768 ? "175px" : "100%")}
                >
                    <Image borderRadius="$5" source={{
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
                    <Group orientation='vertical' width="100%">
                        <SmallButtonWithAccent icon={Plus} name="plus" onClick={(e) => handleChange(e, 'plus')} />
                        <Input
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
                    </Group>
                    <SmallButton width="100%" icon={FileSearch}>{screenSize > 768 ? 'View details' : ''}</SmallButton>
                    <SmallButtonWithAccent width="100%" icon={ShoppingCart} disabled={!isChanged} opacity={isChanged ? "1" : "0.5"} onClick={() => handleAddToCart()}>{screenSize > 768 ? 'Add to cart' : ''}</SmallButtonWithAccent>
                </VerticalContainer>
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default ListItem;