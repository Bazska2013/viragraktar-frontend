import {Form} from "react-bootstrap";
import {useState} from "react";
import axios from "../../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import flowerImage from "../../../assets/defaultFlower.svg";
import {Button, Spinner, YStack, SizableText, XStack, Image, Group, Input} from "tamagui"

const Item = ({props, refetch}) => {

    const [item, setItem] = useState(props);
    const navigate = useNavigate();
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/item/' + item.id, {
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
            <Spinner>
                <span className='sr-only'>Loading...</span>
            </Spinner>
        )
    }

    if (error) {
        return (
            <XStack>
                <SizableText>{error}</SizableText>
            </XStack>
        )
    }

    return (
        <XStack>
            <YStack>
                <Image source={{
                    uri: item.image ? "http://localhost:8000/images/" + item.image : flowerImage,
                    width: 100,
                    height: 100,
                }} />
                <SizableText>{item.name}</SizableText>
                <SizableText>{item.description}</SizableText>
                <SizableText>{item.price}</SizableText>
            </YStack>
            <YStack>
                <Group orientation='horizontal'>
                    <Button onClick={(e) => {handleChange(e, 'remove')}}>
                        -
                    </Button>
                    <Input type='number'
                           name='stock'
                           value={item.stock}
                           key={item.stock}
                           onChange={(e) => handleChange(e, 'field')}
                    />
                    <Button onClick={(e) => {handleChange(e, 'add')}}>
                        +
                    </Button>
                </Group>
                {isChanged ? <Group orientation='horizontal'>
                    <Button onClick={() => handleSubmit()}>Save changes</Button>
                    <Button onClick={() => handleCancel()}>Cancel changes</Button>
                </Group> : <></>}
                <Button onClick={() => navigate('/edit/item/' + item.id, {replace:true})}>
                    Edit Item
                </Button>
            </YStack>
        </XStack>
    )
}

export default Item;