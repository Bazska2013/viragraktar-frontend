import {Button, SizableText, Spinner, Theme, XStack, YStack} from "tamagui";
import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {useEffect, useState} from "react";
import Item from "../../components/item/buy/Item.jsx";
import {ShoppingBasket} from "@tamagui/lucide-icons";
import {useTheme} from "@tamagui/core";
import {BigButton, HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";

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
        <VerticalContainer>
            <BigButton alignSelf="center" icon={ShoppingBasket} onClick={() => {navigate('/new/item', {replace: true})}}>New Item</BigButton>
            {isLoading ?
                <Spinner>
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <HorizontalContainer flexWrap="wrap">
                        {items.map((item) => (
                            <Item key={item.id} props={item} refetch={fetchItems} />
                        ))}
                    </HorizontalContainer>
            }
        </VerticalContainer>
    )
}

export default Buy;