import {AnimatePresence, H2, Sheet, SizableText, Spinner} from "tamagui";
import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import React, {useEffect, useState} from "react";
import Item from "../../components/item/buy/Item.jsx";
import {ShoppingBasket} from "@tamagui/lucide-icons";
import {
    BigButton,
    HorizontalContainer,
    SmallButton,
    SmallButtonWithAccent,
    VerticalContainer
} from "../../tamagui.config.ts";
import CombineItems from "../../components/item/buy/CombineItems.jsx";
import SearchBar from "../../components/item/FilterBar.jsx";
import FilterBar from "../../components/item/FilterBar.jsx";
import {selectStore} from "../../features/store/storeSlice.js";
import {useSelector} from "react-redux";

const Buy = () => {
    const store = useSelector(selectStore);
    const [sign, setSign] = useState('');
    const [before, setBefore] = useState(false);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [thereIsSelected, setThereIsSelected] = useState(false);
    const [show, setShow] = useState(false);

    const [filteredItems, setFilteredItems] = useState([]);
    const [filterString, setFilterString] = useState('');
    const [filterLabels, setFilterLabels] = useState([]);

    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollable = document.body.scrollHeight > window.innerHeight;
            if (scrollable && window.innerHeight + window.scrollY + 150 >= document.body.offsetHeight) {
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
                setFilteredItems(response.data);
            }
        }
    }

    useEffect(() => {
        fetchItems().then((response) => {
            setFilterString('');
            setFilterLabels([]);
            setSign(JSON.parse(store.currency).sign);
            setBefore(JSON.parse(store.currency).before);
        });
    }, []);

    useEffect(() => {
        if (selectedItems.length > 1) {
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

    useEffect(() => {
        if (filterString.length > 0) {
            setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(filterString.toLowerCase())));
        } else {
            setFilteredItems(items);
        }
    }, [filterString]);

    useEffect(() => {
        if (filterLabels.length > 0) {
            setFilteredItems(items.filter((item) => JSON.parse(item.description).labels.some(label => filterLabels.includes(label))));
        } else {
            setFilteredItems(items);
        }
    }, [filterLabels]);

    return (
        <VerticalContainer width="95%" alignSelf="center">
            <FilterBar title="Buy" onTextChange={setFilterString} onLabelChange={setFilterLabels} />
            <BigButton
                zIndex={1000}
                animation="quick"
                x={isAtBottom ? 300 : 0}
                position="fixed"
                bottom={10}
                right={10}
                icon={ShoppingBasket}
                onClick={() => {document.startViewTransition ? document.startViewTransition(() => navigate('/buy/new/')) : navigate('/buy/new/')}}>New item</BigButton>
            <SmallButton
                zIndex={1000}
                bottom={90}
                right={10}
                animation="quick"
                x={thereIsSelected ? 0 : 200}
                position="fixed"
                icon={ShoppingBasket}
                onClick={() => setShow(true)}
            >
                Combine items
            </SmallButton>
            <Sheet
                modal={true}
                open={show}
                onOpenChange={setShow}
                snapPoints={[95]}
                snapPointsMode="percent"
                dismissOnSnapToBottom
                positio={0}
                zIndex={100_000}
                animation="medium"
            >
                <CombineItems items={selectedItems} closeModal={setShow} refetchItems={fetchItems} emptySelection={setSelectedItems} before={before} sign={sign} />
            </Sheet>
            {isLoading ?
                <Spinner color="#292023" size="large" opacity={isLoading ? 1 : 0} animation="slowest">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : error ?
                    <SizableText color="red">
                        {error}
                    </SizableText> :
                    <>
                        <HorizontalContainer flexWrap="wrap" marginLeft={10} marginRight={10} opacity={isLoading ? 0 : 1} animation="slow">
                            {filteredItems.length > 0 && filteredItems.map((item) => (
                                <Item key={item.id} props={item} refetch={fetchItems} addToSelection={handleAddToSelection} removeFromSelection={handleRemoveFromSelection} sign={sign} before={before} />
                            ))}
                            {filteredItems.length === 0 &&
                                <HorizontalContainer flex={1} justifyContent="center" alignItems="center">
                                    <H2>No items found</H2>
                                </HorizontalContainer>
                            }
                        </HorizontalContainer>
                        <BigButton
                            opacity={isLoading ? 0 : 1} animation="slowest"
                            alignSelf="center"
                            marginBottom="5rem"
                            icon={ShoppingBasket}
                            onClick={() => {document.startViewTransition ? document.startViewTransition(() => navigate('/buy/new/')) : navigate('/buy/new/')}}>New item</BigButton>
                    </>
            }
        </VerticalContainer>
    )
}

export default React.memo(Buy);