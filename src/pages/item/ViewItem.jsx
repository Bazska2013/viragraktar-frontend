import React, {useEffect, useState} from "react";
import {H2, H4, Image, Separator, SizableText, Spinner, Square} from "tamagui";
import {EditContainer, HorizontalContainer, SmallButton, VerticalContainer} from "../../tamagui.config.ts";
import {FileSearch, X} from "@tamagui/lucide-icons";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../../axiosConfig.js";
import flowerImage from "../../assets/defaultFlower.svg";
import {useSelector} from "react-redux";
import {selectStore} from "../../features/store/storeSlice.js";

const ViewItem = () => {
    const store = useSelector(selectStore);
    const [sign, setSign] = useState('');
    const [before, setBefore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const navigate = useNavigate();
    const id = useParams().id;
    const [item, setItem] = useState(null);

    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchItem = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.get('/api/item/' + id);
        } catch (error) {
            setIsLoading(false);
            setFetchError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItem(response.data);
            }
        }
    }

    useEffect(() => {
        fetchItem().then(() => {
            setSign(JSON.parse(store.currency).sign);
            setBefore(JSON.parse(store.currency).before);
        });
    }, [id, store.currency]);

    if (fetchError) {
        return (
            <SizableText color="red" >{fetchError}</SizableText>
        )
    }

    if (isLoading) {
        return (
            <Spinner color="#292023">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <EditContainer
            padding="$3"
            marginBottom="5rem"
            width={screenSize > 1280 ? '50%' : screenSize > 768 ? '75%' : '100%'}
        >
            <HorizontalContainer marginTop="3rem" alignItems="center" justifyContent="space-between">
                <H2 marginBottom="1rem">View item</H2>
                <Square animation="quick" pressStyle={{scale: 0.8}} hoverStyle={{scale: 1.2}}
                        onClick={() => {document.startViewTransition ? document.startViewTransition(() => navigate('/sell', {replace: true})) : navigate('/sell', {replace: true})}}
                >
                    <X color="#292023" size="$3" />
                </Square>
            </HorizontalContainer>
            <VerticalContainer>
                <VerticalContainer>
                    <H4>Name of the item</H4>
                    <SizableText>{item?.name}</SizableText>
                </VerticalContainer>
                <Separator />
                <VerticalContainer>
                    <H4>Labels of the item</H4>
                    <HorizontalContainer flexWrap="wrap">
                        {item && JSON.parse(item.description).labels.map((label, index) => (
                            <SizableText key={label || index}>{label}</SizableText>
                        ))}
                    </HorizontalContainer>
                </VerticalContainer>
                <Separator />
                <VerticalContainer>
                    <H4>Price of the item</H4>
                    <SizableText>{before ? sign + item?.price : item?.price + " " + sign}</SizableText>
                </VerticalContainer>
                <Separator />
                <VerticalContainer>
                    <H4>Stock of the item</H4>
                    <SizableText>{item?.stock}</SizableText>
                </VerticalContainer>
                <Separator />
                <VerticalContainer>
                    <H4>Image of the item</H4>
                    <Image borderRadius="$5" boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)" source={{
                        uri: item?.image ? "http://localhost:8000/images/" + item?.image : flowerImage,
                        width: 180,
                        height: 180,
                    }} />
                </VerticalContainer>
                { item && JSON.parse(item.description).connections.length > 0 &&
                    <>
                        <Separator />
                        <VerticalContainer>
                            <H4>Created by combining:</H4>
                            <VerticalContainer>
                                {item && JSON.parse(item.description).connections.map((combinedItem, index) => (
                                    <SmallButton key={combinedItem.id || index} icon={FileSearch}
                                                 onClick={() => {document.startViewTransition ? document.startViewTransition(() => navigate('/sell/view/' + combinedItem.id)) : navigate('/sell/view/' + combinedItem.id)}}
                                    >
                                        {combinedItem.name}
                                    </SmallButton>
                                ))}
                            </VerticalContainer>
                        </VerticalContainer>
                    </>
                }
            </VerticalContainer>
        </EditContainer>
    )
}

export default React.memo(ViewItem);