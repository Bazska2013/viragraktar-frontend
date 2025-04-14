import {HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import {H4, H6, SizableText} from "tamagui";
import axios from "../../axiosConfig.js";
import React, {useEffect, useState} from "react";

const TransactionsTable = ({distShown, items, transactions, sign, before, transShown, totalShown}) => {
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
                {distShown &&
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
                            {items.map((item, index) => {
                                return (
                                    <tr key={item.id} style={{textAlign: 'center', borderBottom: '1px solid #ddd'}}>
                                        <td><SizableText>{item.name}</SizableText></td>
                                        <td><SizableText>{before ? sign + item.price : item.price + " " + sign}</SizableText></td>
                                        <td><SizableText>{item.amount}</SizableText></td>
                                        <td><SizableText>{before ? sign + item.amount * item.price : item.amount * item.price + " " + sign}</SizableText></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </VerticalContainer>
                }
                {transShown &&
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
                            {transactions.map((item, index) => {
                                return (
                                    <tr key={item.id} style={{textAlign: 'center', borderBottom: '1px solid #ddd'}}>
                                        <td><SizableText>{generateDate(item.created_at)}</SizableText></td>
                                        <td><SizableText>{generateTime(item.created_at)}</SizableText></td>
                                        <td><SizableText>{findUserName(item.user_id)}</SizableText></td>
                                        <td><SizableText>{item.credit ? 'Credit card' : 'Cash'}</SizableText></td>
                                        <td><SizableText>{before ? sign + item.total : item.total + " " + sign}</SizableText></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </VerticalContainer>
                }
            </VerticalContainer>
            {totalShown &&
                <HorizontalContainer
                    borderRadius="$5"
                    width="100%"
                    boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                    padding="$3"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <H6>Total</H6>
                    <H6>{before ? sign + items.reduce((acc, item) => acc + item.amount * item.price, 0) : items.reduce((acc, item) => acc + item.amount * item.price, 0) + " " + sign}</H6>
                </HorizontalContainer>
            }
        </VerticalContainer>
    )
}

export default React.memo(TransactionsTable);