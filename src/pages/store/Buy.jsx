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
            response = await axios.get('/api/items');
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                setItems(response.data);
                console.log(response.data);
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