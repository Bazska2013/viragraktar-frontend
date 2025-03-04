import {Col, Container, InputGroup, Row, Form} from "react-bootstrap";
import {useState} from "react";
import axios from "../../../axiosConfig.js";
import {useNavigate} from "react-router-dom";
import flowerImage from "../../../assets/defaultFlower.svg";
import {Button, Spinner, YStack, SizableText, XStack, Image} from "tamagui"

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
            response = await axios.put('/api/item/' + item.id, item);
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
                setItem({...item, [e.target.name]: e.target.name === 'stock' ? Number(e.target.value) : e.target.value});
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
            <p>{error}</p>
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
                <InputGroup>
                    <Button onClick={(e) => {handleChange(e, 'remove')}}>
                        -
                    </Button>
                    <Form.Control
                        type='number'
                        name='stock'
                        value={item.stock}
                        onChange={(e) => handleChange(e, 'field')}
                    />
                    {isChanged ? <>
                        <Button onClick={() => handleSubmit()}>Save changes</Button>
                        <Button onClick={() => handleCancel()}>Cancel changes</Button>
                    </> : <></>}
                    <Button onClick={(e) => {handleChange(e, 'add')}}>
                        +
                    </Button>
                </InputGroup>
                <Button onClick={() => navigate('/edit/item/' + item.id, {replace:true})}>
                    Edit Item
                </Button>
            </YStack>
        </XStack>
    )
}

export default Item;