import {HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import {H4, H6, SizableText} from "tamagui";
import axios from "../../axiosConfig.js";
import {useEffect, useState} from "react";

const TransactionsTable = (props) => {
    const [storeUsers, setStoreUsers] = useState([]);

    useEffect(() => {
        fetchStoreUsers();
    }, []);

    const generateDate = (dateString) => {
        const date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return `${year}. ${month}. ${day}.`;
    }

    const generateTime = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return `${hours}:${minutes}`;
    }

    const fetchStoreUsers = async () => {
        let response;
        try {
            response = await axios.get('/api/store/users');
        } catch (error) {
            console.error(error);
        } finally {
            setStoreUsers(response.data);
        }
    }

    const findUserName = (userId) => {
        for (let user of storeUsers) {
            if (user.id === userId) {
                return user.name;
            }
        }
    }

    return (
        <VerticalContainer width="100%" alignSelf="center" alignItems="center">
            <VerticalContainer width="100%">
                {props.distShown &&
                    <VerticalContainer
                        borderRadius="$5"
                        width="100%"
                        boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                        padding="$3"
                        height="max-content"
                    >
                        <H4 alignSelf="center">Item distribution</H4>
                        <table width="100%" id="distTable">
                            <thead>
                            <tr style={{textAlign: 'center', borderBottom: '1px solid #ddd'}}>
                                <th><H6>Name</H6></th>
                                <th><H6>Price</H6></th>
                                <th><H6>Amount</H6></th>
                                <th><H6>Revenue</H6></th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.items.map((item, index) => {
                                return (
                                    <tr key={index} style={{textAlign: 'center', borderBottom: '1px solid #ddd'}}>
                                        <td><SizableText>{item.name}</SizableText></td>
                                        <td><SizableText>{item.price}</SizableText></td>
                                        <td><SizableText>{item.amount}</SizableText></td>
                                        <td><SizableText>{item.amount * item.price}</SizableText></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </VerticalContainer>
                }
                {props.transShown &&
                    <VerticalContainer
                        borderRadius="$5"
                        width="100%"
                        boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                        padding="$3"
                        alignSelf="center"
                    >
                        <H4 alignSelf="center">Transactions history</H4>
                        <table width="100%" id="transTable">
                            <thead>
                            <tr style={{textAlign: 'center', borderBottom: '1px solid #ddd'}}>
                                <th><H6>Date</H6></th>
                                <th><H6>Time</H6></th>
                                <th><H6>User</H6></th>
                                <th><H6>Payment method</H6></th>
                                <th><H6>Total income</H6></th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.transactions.map((item, index) => {
                                return (
                                    <tr key={index} style={{textAlign: 'center', borderBottom: '1px solid #ddd'}}>
                                        <td><SizableText>{generateDate(item.created_at)}</SizableText></td>
                                        <td><SizableText>{generateTime(item.created_at)}</SizableText></td>
                                        <td><SizableText>{findUserName(item.user_id)}</SizableText></td>
                                        <td><SizableText>{item.credit ? 'Credit card' : 'Cash'}</SizableText></td>
                                        <td><SizableText>{item.total}</SizableText></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </VerticalContainer>
                }
            </VerticalContainer>
            {props.totalShown &&
                <HorizontalContainer
                    borderRadius="$5"
                    width="100%"
                    boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                    padding="$3"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <H6>Total</H6>
                    <H6>HUF {props.items.reduce((acc, item) => acc + item.amount * item.price, 0)}</H6>
                </HorizontalContainer>
            }
        </VerticalContainer>
    )
}

export default TransactionsTable;