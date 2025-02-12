import {Button, Row, Spinner} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig.js";
import {useEffect, useState} from "react";
import Item from "../../components/item/buy/Item.jsx";

const Buy = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        let response;
        setIsLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
            response = await axios.get('/api/items', {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
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
        <>
            <Row>
                <Button onClick={() => {navigate('/new/item', {replace: true})}}>New Item</Button>
            </Row>
            {isLoading ? <>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <>{error ? <>
                {error}
            </> : <>
                <Row>
                    {items.map((item) => (
                        <Item key={item.id} props={item} refetch={fetchItems} />
                    ))}
                </Row>
            </>}</>}
        </>
    )
}

export default Buy;