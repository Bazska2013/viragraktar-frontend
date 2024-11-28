import {useEffect, useState} from "react";
import axios from '../../axiosConfig.js';
import {Row} from "react-bootstrap";
import Item from "../../components/item/sell/Item.jsx";

const Sell = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            await axios.get('sanctum/csrf-cookie', {
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
            console.log(error);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <>
            <Row>
                {items.map((item) => (
                    <Item key={item.id} props={item} />
                ))}
            </Row>
        </>
    )
}

export default Sell;