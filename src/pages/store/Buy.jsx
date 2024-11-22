import {Button, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {useEffect, useState} from "react";
import Item from "../../components/item/buy/Item.jsx";

const Buy = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            const response = await axios.get('/api/items', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            if (response.status === 200) {
                setItems(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <>
            <Row>
                <Button onClick={() => {navigate('/new/item', {replace: true})}}>New Item</Button>
            </Row>
            <Row>
                {items.map((item) => (
                    <Item key={item.id} props={item}/>
                ))}
            </Row>
        </>
    )
}

export default Buy;