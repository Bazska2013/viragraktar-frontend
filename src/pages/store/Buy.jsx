import {Button, SizableText, Spinner, XStack, YStack} from "tamagui";
import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {useEffect, useState} from "react";
import Item from "../../components/item/buy/Item.jsx";
import {ShoppingBasket} from "@tamagui/lucide-icons";

const Buy = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <YStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$5"
            padding="$5"
        >
            <Button alignSelf="center" icon={ShoppingBasket} size="$6" theme="accent" onClick={() => {navigate('/new/item', {replace: true})}}>New Item</Button>
            {isLoading ?
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <XStack
                        flex={1}
                        flexWrap="wrap"
                        gap="$5"
                    >
                        {items.map((item) => (
                            <Item key={item.id} props={item} refetch={fetchItems} />
                        ))}
                    </XStack>
            }
        </YStack>
    )
}

export default Buy;