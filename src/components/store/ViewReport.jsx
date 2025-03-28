import {HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {Checkbox, Group, H2, H4, Input, Label, SizableText, Switch} from "tamagui";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryHistogram, VictoryLine, VictoryPie, VictoryTheme} from "victory";
import {Check} from "@tamagui/lucide-icons";
import DatePicker from "../datePicker/DatePicker.jsx";
import TransactionsTable from "./TransactionsTable.jsx";

const ViewReport = () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [items, setItems] = useState([]);
    const [oneDay, setOneDay] = useState(true);
    const [showDistribution, setShowDistribution] = useState(true);
    const [showRevenue, setShowRevenue] = useState(true);
    const [showTable, setShowTable] = useState(true);

    const fetchDayData = async () => {
        if (date !== '') {
            let response;
            try {
                response = await axios.get('/api/transactions/' + date);
            } catch (error) {
                console.error(error);
            } finally {
                setData(response.data);
            }
        }
    }

    const fetchRangeData = async () => {
        if (start !== '' && end !== '') {
            let response;
            try {
                response = await axios.get('/api/transactions/' + start + '/' + end);
            } catch (error) {
                console.error(error);
            } finally {
                setData(response.data);
            }
        }
    }

    useEffect(() => {
        setItemsFromData()
    }, [data])

    const setItemsFromData = () => {
        let newItems = [];
        for (let transaction of data) {
            for (let item of transaction.items) {
                newItems.push(item);
            }
        }
        setItems(newItems);
    }

    const aggregateItems = () => {
        const itemCounts = items.reduce((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + item.amount;
            return acc;
        }, {});

        return Object.keys(itemCounts).map(name => ({
            name,
            price: items.find(item => item.name === name).price,
            amount: itemCounts[name]
        }));
    }

    const aggregateTransactions = () => {
        const modifiedData = data.map(transaction => {
            const date = new Date(transaction.created_at);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            return {
                created_at: year + '. ' + month + '. ' + day + '.',
                total: transaction.total
            }
        });
        const transactionCounts = modifiedData.reduce((acc, transaction) => {
            acc[transaction.created_at] = (acc[transaction.created_at] || 0) + transaction.total;
            return acc;
        }, {});

        return Object.keys(transactionCounts).map(created_at => ({
            created_at,
            total: transactionCounts[created_at]
        }));
    }

    const readableData = () => {
        if (oneDay) {
            return data.map(transaction => {
                const date = new Date(transaction.created_at);
                let hour = date.getHours();
                let minute = date.getMinutes();
                if (hour < 10) {
                    hour = '0' + hour;
                }
                if (minute < 10) {
                    minute = '0' + minute;
                }
                return {
                    created_at: hour + ':' + minute,
                    total: transaction.total
                }
            })
        }
        return aggregateTransactions();
    }

    const handleGenerateReport = () => {
        if (oneDay) {
            fetchDayData();
        } else {
            fetchRangeData();
        }
    }

    return (
        <VerticalContainer>
            <H2>View report</H2>
            <HorizontalContainer alignItems="center">
                {oneDay ? <>
                    <Label htmlFor="date">
                        <H4>Select date</H4>
                    </Label>
                    <DatePicker id="date" setValue={setDate} />
                </> : <>
                    <Label htmlFor="start">
                        <H4>From</H4>
                    </Label>
                    <DatePicker id="start" setValue={setStart} />
                    <SizableText>-</SizableText>
                    <Label htmlFor="end">
                        <H4>To</H4>
                    </Label>
                    <DatePicker id="end" setValue={setEnd} />
                </>}
            </HorizontalContainer>
            <HorizontalContainer alignItems="center">
                <SmallButtonWithAccent onClick={handleGenerateReport}>Generate report</SmallButtonWithAccent>
                <HorizontalContainer alignItems="center">
                    <Label htmlFor="day">
                        <H4>Change mode</H4>
                    </Label>
                    <Checkbox id="day" checked={oneDay} onCheckedChange={() => setOneDay(!oneDay)}>
                        <Checkbox.Indicator>
                            <Check />
                        </Checkbox.Indicator>
                    </Checkbox>
                </HorizontalContainer>
            </HorizontalContainer>
            <HorizontalContainer alignItems="center" justifyContent="space-between">
                <HorizontalContainer alignItems="center">
                    <Label htmlFor="dist">
                        <H4>Show distribution</H4>
                    </Label>
                    <Checkbox id="dist" checked={showDistribution} onCheckedChange={() => setShowDistribution(!showDistribution)}>
                        <Checkbox.Indicator>
                            <Check />
                        </Checkbox.Indicator>
                    </Checkbox>
                </HorizontalContainer>
                <HorizontalContainer alignItems="center">
                    <Label htmlFor="rev">
                        <H4>Show revenue</H4>
                    </Label>
                    <Checkbox id="rev" checked={showRevenue} onCheckedChange={() => setShowRevenue(!showRevenue)}>
                        <Checkbox.Indicator>
                            <Check />
                        </Checkbox.Indicator>
                    </Checkbox>
                </HorizontalContainer>
                <HorizontalContainer alignItems="center">
                    <Label htmlFor="table">
                        <H4>Show transactions table</H4>
                    </Label>
                    <Checkbox id="table" checked={showTable} onCheckedChange={() => setShowTable(!showTable)}>
                        <Checkbox.Indicator>
                            <Check />
                        </Checkbox.Indicator>
                    </Checkbox>
                </HorizontalContainer>
            </HorizontalContainer>
            {data.length > 0 &&
                <VerticalContainer>
                    <H4>{oneDay ? 'Report about ' + date : 'Report made from ' + start + ' to ' + end}</H4>
                    <HorizontalContainer height='300px'>
                        {showDistribution &&
                            <VerticalContainer alignItems="center" justifyContent="center">
                                <VictoryChart
                                    theme={VictoryTheme.grayscale}
                                    domainPadding={20}
                                >
                                    <VictoryBar
                                        x="name"
                                        y="amount"
                                        data={aggregateItems()}
                                        animate={{duration: 500}}
                                    />
                                </VictoryChart>
                                {/*<VictoryPie*/}
                                {/*    data={aggregateItems()}*/}
                                {/*    x="name"*/}
                                {/*    y="amount"*/}
                                {/*    theme={VictoryTheme.grayscale}*/}
                                {/*    categories={{x: items.map(item => item.name)}}*/}
                                {/*    animate={{duration: 500}}*/}
                                {/*/>*/}
                                <H4>Distribution of items sold</H4>
                            </VerticalContainer>
                        }
                        {showRevenue &&
                            <VerticalContainer alignItems="center" justifyContent="center">
                                <VictoryChart
                                    theme={VictoryTheme.grayscale}
                                    domainPadding={{ x: 10 }}
                                    animate={{duration: 500}}
                                >
                                    <VictoryLine data={readableData()} x='created_at' y='total' />
                                </VictoryChart>
                                <H4>Revenue from transactions</H4>
                            </VerticalContainer>
                        }
                    </HorizontalContainer>
                    {showTable &&
                        <VerticalContainer alignItems="center" justifyContent="center">
                            <TransactionsTable items={aggregateItems()} transactions={data} />
                        </VerticalContainer>
                    }
                </VerticalContainer>
            }
            {/*{items.map((item, index) => (*/}
            {/*    <SizableText key={index}>{item.name}</SizableText>*/}
            {/*))}*/}
        </VerticalContainer>
    )
}

export default ViewReport