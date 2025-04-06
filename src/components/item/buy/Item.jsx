import {useEffect, useState} from "react";
import axios from "../../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import flowerImage from "../../../assets/defaultFlower.svg";
import {Spinner, SizableText, Image, Group, Input, H4} from "tamagui"
import {Check, X, Plus, Minus, PenSquare} from "@tamagui/lucide-icons";
import {
    HorizontalContainer,
    SmallButton,
    SmallButtonWithAccent,
    StyledGroup,
    VerticalContainer
} from "../../../tamagui.config.ts";

const Item = ({props, refetch}) => {

    const [item, setItem] = useState(props);
    const navigate = useNavigate();
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
                    justifyContent="center"
                    width={screenSize > 1280 ? "350px" : (screenSize > 768 ? "300px" : "100%")}
                >{error}</SizableText>
            </HorizontalContainer>
        )
    }

    return (
        <HorizontalContainer
            borderRadius="$5"
            boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
            alignSelf="center"
            flex={1}
            padding="$3"
            height="425px"
        >
            <VerticalContainer
                flex={5}
                alignItems="center"
                width={screenSize > 1280 ? "200px" : (screenSize > 768 ? "175px" : "100%")}
                justifyContent="space-between"
            >
                <Image onClick={(e) => {handleChange(e, 'add')}} borderRadius="$5" boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)" source={{
                    uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                    width: 180,
                    height: 180,
                }} />
                <H4>{item.name}</H4>
                <SizableText>{item.description}</SizableText>
                <SizableText>Price: HUF {item.price}</SizableText>
            </VerticalContainer>
            <VerticalContainer
                flex={1}
                width={screenSize > 1280 ? "120px" : (screenSize > 768 ? "110px" : "100px")}
                alignItems="center"
                height="max-content"
            >
                <StyledGroup orientation='vertical' width="100%">
                    <SmallButtonWithAccent icon={Plus} onClick={(e) => {handleChange(e, 'add')}} />
                    <Input
                        backgroundColor="none"
                        flex={1}
                        borderWidth={2}
                        type='number'
                        name='stock'
                        value={item.stock}
                        key={item.stock}
                        onChange={(e) => handleChange(e, 'field')}
                    />
                    <SmallButtonWithAccent icon={Minus} onClick={(e) => {handleChange(e, 'remove')}} />
                </StyledGroup>
                <StyledGroup orientation={screenSize > 768 ? 'horizontal' : 'vertical'} width="100%" flex={1}>
                    <SmallButton boxShadow="unset" flex={1} icon={X} disabled={!isChanged} chromeless={!isChanged} onClick={() => handleCancel()} />
                    <SmallButton boxShadow="unset" flex={1} icon={Check} disabled={!isChanged} chromeless={!isChanged} onClick={() => handleSubmit()} />
                </StyledGroup>
                <SmallButtonWithAccent icon={PenSquare} width="100%" onClick={() => navigate('/edit/item/' + item.id, {replace:true})}>
                    {screenSize > 768 ? 'Edit item' : ''}
                </SmallButtonWithAccent>
            </VerticalContainer>
        </HorizontalContainer>
    )
}

export default Item;