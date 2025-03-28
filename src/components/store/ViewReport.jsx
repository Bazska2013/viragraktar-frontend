import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {Checkbox, Group, H2, H4, H6, Input, Label, Select, Separator, SizableText, Switch} from "tamagui";
import {Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryHistogram,
    VictoryLine,
    VictoryPie,
    VictoryScatter,
    VictoryTheme
} from "victory";
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
    const [showPie, setShowPie] = useState(true);
    const [showLine, setShowLine] = useState(true);
    const [showDistTable, setShowDistTable] = useState(true);
    const [showTransactionTable, setShowTransactionTable] = useState(true);
    const [showTotal, setShowTotal] = useState(true);

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

    const handleTableStyle = (value) => {
        switch (value) {
            case 'Distribution':
                setShowDistTable(true);
                setShowTransactionTable(false);
                setShowTotal(false);
                break;
            case 'Transactions':
                setShowDistTable(false);
                setShowTransactionTable(true);
                setShowTotal(false);
                break;
            case 'All':
                setShowDistTable(true);
                setShowTransactionTable(true);
                setShowTotal(true);
                break;
        }
    }

    return (
        <VerticalContainer>
            <H2>View report</H2>
            <VerticalContainer
                borderRadius="$5"
                width="100%"
                alignSelf="center"
                boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                padding="$3"
            >
                <HorizontalContainer alignItems="center">
                    <HorizontalContainer alignItems="center">
                        <Label htmlFor="day">
                            <H6>Get data from</H6>
                        </Label>
                        <Form.Select defaultValue="one day" id="day" onChange={(e) => setOneDay(e.target.value === 'one day')}>
                            <option>one day</option>
                            <option>range</option>
                        </Form.Select>
                    </HorizontalContainer>
                </HorizontalContainer>
                <Separator />
                <HorizontalContainer alignItems="center">
                    {oneDay ? <>
                        <Label htmlFor="date">
                            <SizableText>Select date:</SizableText>
                        </Label>
                        <DatePicker id="date" setValue={setDate} />
                    </> : <>
                        <Label htmlFor="start">
                            <SizableText>Select range: From</SizableText>
                        </Label>
                        <DatePicker id="start" setValue={setStart} />
                        <SizableText>-</SizableText>
                        <Label htmlFor="end">
                            <SizableText>to</SizableText>
                        </Label>
                        <DatePicker id="end" setValue={setEnd} />
                    </>}
                </HorizontalContainer>
                <Separator />
                <VerticalContainer justifyContent="space-between">
                    <H4>Options</H4>
                    <VerticalContainer justifyContent="space-between">
                        <HorizontalContainer alignItems="center">
                            <Label htmlFor="dist">
                                <SizableText>Distribution</SizableText>
                            </Label>
                            <Checkbox id="dist" checked={showDistribution} onCheckedChange={() => setShowDistribution(!showDistribution)}>
                                <Checkbox.Indicator>
                                    <Check />
                                </Checkbox.Indicator>
                            </Checkbox>
                            {showDistribution &&
                                <>
                                    <Label htmlFor="distStyle">
                                        <SizableText>Style:</SizableText>
                                    </Label>
                                    <Form.Select defaultValue="Pie" id="distStyle" onChange={(e) => setShowPie(e.target.value === 'Pie')}>
                                        <option>Pie</option>
                                        <option>Bar</option>
                                    </Form.Select>
                                </>
                            }
                        </HorizontalContainer>
                        <Separator />
                        <HorizontalContainer alignItems="center">
                            <Label htmlFor="rev">
                                <SizableText>Revenue</SizableText>
                            </Label>
                            <Checkbox id="rev" checked={showRevenue} onCheckedChange={() => setShowRevenue(!showRevenue)}>
                                <Checkbox.Indicator>
                                    <Check />
                                </Checkbox.Indicator>
                            </Checkbox>
                            {showRevenue &&
                                <>
                                    <Label htmlFor="revStyle">
                                        <SizableText>Style:</SizableText>
                                    </Label>
                                    <Form.Select defaultValue="Line" id="revStyle" onChange={(e) => setShowLine(e.target.value === 'Line')}>
                                        <option>Line</option>
                                        <option>Scatter</option>
                                    </Form.Select>
                                </>
                            }
                        </HorizontalContainer>
                        <Separator />
                        <VerticalContainer>
                            <HorizontalContainer alignItems="center">
                                <Label htmlFor="table">
                                    <SizableText>Transactions table</SizableText>
                                </Label>
                                <Checkbox id="table" checked={showTable} onCheckedChange={() => setShowTable(!showTable)}>
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                                {showTable &&
                                    <>
                                        <Label htmlFor="tableStyle">
                                            <SizableText>Show:</SizableText>
                                        </Label>
                                        <Form.Select defaultValue="All" id="tableStyle" onChange={(e) => handleTableStyle(e.target.value)}>
                                            <option>Distribution</option>
                                            <option>Transactions</option>
                                            <option>All</option>
                                        </Form.Select>
                                    </>
                                }
                            </HorizontalContainer>
                            {showTable && <HorizontalContainer>
                                <Label htmlFor="tableTotal">
                                    <SizableText>Show total</SizableText>
                                </Label>
                                <Checkbox id="tableTotal" checked={showTotal} onCheckedChange={() => setShowTotal(!showTotal)}>
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                            </HorizontalContainer>}
                        </VerticalContainer>
                    </VerticalContainer>
                </VerticalContainer>
                <Separator />
                <BigButton onClick={handleGenerateReport}>Generate report</BigButton>
            </VerticalContainer>
            {data.length > 0 &&
                <VerticalContainer>
                    <H4
                        borderRadius="$5"
                        width="100%"
                        alignSelf="center"
                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                        padding="$3"
                    >{oneDay ? 'Report about ' + date : 'Report made from ' + start + ' to ' + end}</H4>
                    <HorizontalContainer width="100%" justifyContent="center" alignSelf="center">
                        {showDistribution &&
                            <VerticalContainer alignItems="center" justifyContent="center"
                                               borderRadius="$5"
                                               boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                                               padding="$3"
                            >
                                <H4>Distribution of items sold</H4>
                                {showPie ?
                                    <VictoryPie
                                        data={aggregateItems()}
                                    x="name"
                                    y="amount"
                                    theme={VictoryTheme.grayscale}
                                    categories={{x: items.map(item => item.name)}}
                                />
                                    :
                                    <VictoryChart
                                    theme={VictoryTheme.grayscale}
                                domainPadding={50}
                            >
                                <VictoryBar
                                    x="name"
                                    y="amount"
                                    data={aggregateItems()}
                                    animate={{duration: 500}}
                                />
                            </VictoryChart>
                        }
                            </VerticalContainer>
                        }
                        {showRevenue &&
                            <VerticalContainer alignItems="center" justifyContent="center"
                                               borderRadius="$5"
                                               boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                                               padding="$3"
                            >
                                <H4>Revenue from transactions</H4>
                                <VictoryChart
                                    theme={VictoryTheme.grayscale}
                                    domainPadding={50}
                                    animate={{duration: 500}}
                                >
                                    {showLine ?
                                        <VictoryLine data={readableData()} x='created_at' y='total' />
                                        :
                                        <VictoryScatter data={readableData()} x='created_at' y='total' />
                                    }
                                </VictoryChart>
                            </VerticalContainer>
                        }
                    </HorizontalContainer>
                    {showTable &&
                        <VerticalContainer alignItems="center" justifyContent="center">
                            <TransactionsTable items={aggregateItems()} transactions={data} distShown={showDistTable} transShown={showTransactionTable} totalShown={showTotal} />
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