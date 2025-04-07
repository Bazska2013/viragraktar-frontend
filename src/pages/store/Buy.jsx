import {AnimatePresence, H2, SizableText, Spinner} from "tamagui";
import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {useEffect, useState} from "react";
import Item from "../../components/item/buy/Item.jsx";
import {ShoppingBasket} from "@tamagui/lucide-icons";
import {
    BigButton,
    HorizontalContainer,
    SmallButton,
    SmallButtonWithAccent,
    VerticalContainer
} from "../../tamagui.config.ts";

const Buy = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [thereIsSelected, setThereIsSelected] = useState(false);

    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollable = document.body.scrollHeight > window.innerHeight;
            setIsScrollable(scrollable);
            if (scrollable && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                setIsAtBottom(true);
            } else {
                setIsAtBottom(false);
            }
        }
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const fetchItems = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/items');
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItems(response.data);
            }
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (selectedItems.length > 0) {
            setThereIsSelected(true);
        } else {
            setThereIsSelected(false);
        }
    }, [selectedItems]);

    const handleAddToSelection = (item) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems([...selectedItems, item]);
        }
    }

    const handleRemoveFromSelection = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        }
    }

    return (
        <VerticalContainer height="100%" width="90%" alignSelf="center">
            <H2 marginLeft={10} marginRight={10}>Buy</H2>
            <AnimatePresence>
                {isScrollable && !isAtBottom &&
                    <BigButton
                        zIndex={1000}
                        animation="quick"
                        enterStyle={{x: 300}}
                        exitStyle={{x: 300}}
                        position="fixed"
                        bottom={10}
                        right={10}
                        icon={ShoppingBasket}
                        onClick={() => {navigate('/new/item', {replace: true})}}>New item</BigButton>
                }
            </AnimatePresence>
            <AnimatePresence>
                {thereIsSelected &&
                    <SmallButton
                        zIndex={1000}
                        bottom={90}
                        right={10}
                        animation="quick"
                        enterStyle={{
                            x: 400,
                        }}
                        exitStyle={{
                            x: 400,
                        }}
                        position="fixed"
                        icon={ShoppingBasket}
                    >
                        Combine items
                    </SmallButton>
                }
            </AnimatePresence>
            {isLoading ?
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <HorizontalContainer flexWrap="wrap" marginLeft={10} marginRight={10}>
                        {items.map((item) => (
                            <Item key={item.id} props={item} refetch={fetchItems} addToSelection={handleAddToSelection} removeFromSelection={handleRemoveFromSelection} />
                        ))}
                    </HorizontalContainer>
            }
            <BigButton
                alignSelf="center"
                marginBottom="5rem"
                icon={ShoppingBasket}
                onClick={() => {navigate('/new/item', {replace: true})}}>New item</BigButton>
        </VerticalContainer>
    )
}

export default Buy;