import {Form} from "react-bootstrap";
import {useState} from "react";
import axios from "../../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import flowerImage from "../../../assets/defaultFlower.svg";
import {Button, Spinner, YStack, SizableText, XStack, Image, Group, Input, H3, H4} from "tamagui"
import {Check, X, Plus, Minus} from "@tamagui/lucide-icons";
import {HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "../../../tamagui.config.ts";

const Item = ({props, refetch}) => {

    const [item, setItem] = useState(props);
    const navigate = useNavigate();
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const screenSize = window.innerWidth;

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/item/edit/' + item.id, {
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItem(response.data);
                setIsChanged(false);
                refetch();
            }
        }
    }

    const handleChange = (e, type) => {
        switch (type) {
            case 'add':
                setItem({...item, stock: item.stock + 1});
                break;
            case 'remove':
                setItem({...item, stock: item.stock - 1});
                break;
            case 'field':
                setItem({...item, stock: Number(e.target.value)});
                break;
        }
        setIsChanged(true);
    }

    const handleCancel = () => {
        setItem(props);
        setIsChanged(false);
    }

    if (isLoading) {
        return (
            <HorizontalContainer>
                <Spinner>
                    <span className='sr-only'>Loading...</span>
                </Spinner>
            </HorizontalContainer>
        )
    }

    if (error) {
        return (
            <HorizontalContainer>
                <SizableText
                    flex={1}
                    borderWidth={2}
                    // borderColor="$color"
                    // borderRadius="$4"
                    // gap="$2"
                    // padding="$2"
                    justifyContent="center"
                    width={screenSize > 1280 ? "350px" : (screenSize > 768 ? "300px" : "100%")}
                >{error}</SizableText>
            </HorizontalContainer>
        )
    }

    return (
        <HorizontalContainer
            borderRadius="$5"
            boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
            alignSelf="center"
            flex={1}
            padding="$3"
        >
            <VerticalContainer
                flex={2}
                alignItems="center"
                width={screenSize > 1280 ? "200px" : (screenSize > 768 ? "175px" : "100%")}
            >
                <Image borderRadius="$5" source={{
                    uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                    width: 100,
                    height: 100,
                }} />
                <H4>{item.name}</H4>
                <SizableText>{item.description}</SizableText>
                <SizableText>{item.price}</SizableText>
            </VerticalContainer>
            <VerticalContainer
                flex={1}
                width={screenSize > 1280 ? "150px" : (screenSize > 768 ? "125px" : "100%")}
            >
                <Group orientation='vertical'>
                    <SmallButtonWithAccent icon={Plus} onClick={(e) => {handleChange(e, 'add')}} />
                    <Input flex={1}
                           // size="$3"
                           borderWidth={2}
                           type='number'
                           name='stock'
                           value={item.stock}
                           key={item.stock}
                           onChange={(e) => handleChange(e, 'field')}
                    />
                    <SmallButtonWithAccent icon={Minus} onClick={(e) => {handleChange(e, 'remove')}} />
                </Group>
                <Group orientation='horizontal'>
                    <SmallButton icon={X} disabled={!isChanged} chromeless={!isChanged} onClick={() => handleCancel()} width="50%" />
                    <SmallButton icon={Check} disabled={!isChanged} chromeless={!isChanged} onClick={() => handleSubmit()} width="50%" />
                </Group>
                <SmallButtonWithAccent onClick={() => navigate('/edit/item/' + item.id, {replace:true})}>
                    Edit Item
                </SmallButtonWithAccent>
            </VerticalContainer>
        </HorizontalContainer>
    )
}

export default Item;