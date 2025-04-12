import {BigButton, HorizontalContainer, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";
import {Checkbox, H2, H4, H6, Label, Separator, SizableText, Spinner} from "tamagui";
import {Form} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import axios from "../../axiosConfig.js";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryPie, VictoryScatter, VictoryTheme} from "victory";
import {Check, Download, LineChart} from "@tamagui/lucide-icons";
import DatePicker from "../datePicker/DatePicker.jsx";
import TransactionsTable from "./TransactionsTable.jsx";
import {Document, Image, Page, PDFDownloadLink, Text, View} from '@react-pdf/renderer';
import {toPng} from "html-to-image";

const ViewReport = ({sign, before}) => {
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
    const [reportGenerated, setReportGenerated] = useState(false);

    const [downloading, setDownloading] = useState(false);
    const pdfDownloadLinkRef = useRef(null);

    const fetchDayData = async () => {
        if (date !== '') {
            let response;
            try {
                response = await axios.get('/api/transactions/' + date);
            } catch (error) {
                console.error(error);
            } finally {
                setData((response.data).sort((a, b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()));
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
                setData((response.data).sort((a, b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()));
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
        setReportGenerated(false);
        if (oneDay) {
            fetchDayData();
        } else {
            fetchRangeData();
        }
        setTimeout(() => {
            setReportGenerated(true);
        }, 500);
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

    const captureComponentAsImage = async (type) => {
        const element = document.getElementById(type);
        if (!element) {
            return;
        }
        try {
            return await toPng(element);
        } catch (error) {
            console.error("Error capturing component:", error);
            return null;
        }
    };

    const MyDocument = () => {
        const distChartImage = captureComponentAsImage('distChartContainer');
        const transChartImage = captureComponentAsImage('transChartContainer');
        const distTableImage = captureComponentAsImage('distTable');
        const transTableImage = captureComponentAsImage('transTable');
        return (
            <Document>
                <Page size="A4">
                    <View style={{padding: '10px'}}>
                        <Text style={{borderRadius: '10px', border: '1px solid lightgray', padding: '10px', margin: '10px'}}>{oneDay ? 'Report about ' + date : 'Report made from ' + start + ' to ' + end}</Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: '10px'}}>
                        {(showDistribution && distChartImage) &&
                            <View style={{borderRadius: '10px', border: '1px solid lightgray', padding: '10px', margin: '10px'}}>
                                <Text style={{alignSelf: 'center'}}>Distribution of items sold</Text>
                                <Image src={distChartImage} />
                            </View>
                        }
                        {(showRevenue && transChartImage) &&
                            <View style={{borderRadius: '10px', border: '1px solid lightgray', padding: '10px', margin: '10px'}}>
                                <Text style={{alignSelf: 'center'}}>Revenue from transactions</Text>
                                <Image src={transChartImage} />
                            </View>
                        }
                    </View>
                    <View style={{padding: '10px'}}>
                        {(showDistTable && distTableImage) &&
                            <View style={{borderRadius: '10px', border: '1px solid lightgray', padding: '10px', margin: '10px'}}>
                                <Text style={{alignSelf: 'center', marginBottom: '10px'}}>Item distribution</Text>
                                <Image src={distTableImage} />
                            </View>
                        }
                        {(showTransactionTable && transTableImage) &&
                            <View style={{borderRadius: '10px', border: '1px solid lightgray', padding: '10px', margin: '10px'}}>
                                <Text style={{alignSelf: 'center', marginBottom: '10px'}}>Transactions history</Text>
                                <Image src={transTableImage} />
                            </View>
                        }
                        {showTotal &&
                            <View style={{borderRadius: '10px', border: '1px solid lightgray', padding: '10px', margin: '10px', flexDirection: 'row', justifyContent: 'space-between'}} break="before">
                                <Text>Total</Text>
                                <Text>{data.reduce((acc, transaction) => acc + transaction.total, 0)}</Text>
                            </View>
                        }
                    </View>
                </Page>
            </Document>
        );
    };

    const handleDownloadReport = () => {
        setDownloading(true);
        pdfDownloadLinkRef.current.link.click();
    }

    return (
        <VerticalContainer>
            <H2>View report</H2>
            <ProfileContainer>
                <HorizontalContainer alignItems="center">
                    <Label htmlFor="day">
                        <H6>Get data from</H6>
                    </Label>
                    <Form.Select defaultValue="one day" id="day" onChange={(e) => setOneDay(e.target.value === 'one day')}>
                        <option>one day</option>
                        <option>range</option>
                    </Form.Select>
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
                <HorizontalContainer justifyContent="space-between">
                    <BigButton icon={LineChart} onClick={handleGenerateReport}>Generate report</BigButton>
                    {reportGenerated &&
                        <PDFDownloadLink document={<MyDocument />} fileName={oneDay ? date + '-report' : start + '-' + end + '-report'} ref={pdfDownloadLinkRef}>
                            {({ url, loading }) => (
                                <BigButton icon={Download} disabled={downloading || loading} onClick={handleDownloadReport}>
                                    {loading ? <Spinner /> : 'Download PDF'}
                                </BigButton>
                            )}
                        </PDFDownloadLink>
                    }
                </HorizontalContainer>
            </ProfileContainer>
            {data.length > 0 ?
                <VerticalContainer>
                    <H4
                        borderRadius="$5"
                        width="100%"
                        alignSelf="center"
                        boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                        padding="$3"
                    >{oneDay ? 'Report about ' + date : 'Report made from ' + start + ' to ' + end}</H4>
                    <HorizontalContainer width="100%" justifyContent="center" alignSelf="center">
                        {showDistribution &&
                                <VerticalContainer alignItems="center" justifyContent="center"
                                                   borderRadius="$5"
                                                   boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                                                   padding="$3"
                                >
                                    <H4>Distribution of items sold</H4>
                                    <div id="distChartContainer">
                                        {showPie ? (
                                            <VictoryPie
                                                data={aggregateItems()}
                                                x="name"
                                                y="amount"
                                                theme={VictoryTheme.grayscale}
                                                categories={{ x: items.map(item => item.name) }}
                                                width={350}
                                                height={350}
                                            />
                                        ) : (
                                            <VictoryChart theme={VictoryTheme.grayscale} domainPadding={50}>
                                                <VictoryAxis
                                                    fixLabelOverlap
                                                    style={{
                                                        tickLabels: {
                                                            angle: 0,
                                                            fontSize: 15,
                                                            padding: 5
                                                        }
                                                    }}
                                                />
                                                <VictoryAxis
                                                    dependentAxis
                                                    style={{
                                                        tickLabels: {
                                                            angle: 0,
                                                            fontSize: 15,
                                                            padding: 5
                                                        }
                                                    }}
                                                />
                                                <VictoryBar
                                                    x="name"
                                                    y="amount"
                                                    data={aggregateItems()}
                                                    animate={{ duration: 500 }}
                                                />
                                            </VictoryChart>
                                        )}
                                    </div>
                                </VerticalContainer>
                        }
                        {showRevenue &&
                            <VerticalContainer alignItems="center" justifyContent="center"
                                               borderRadius="$5"
                                               boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                                               padding="$3"
                            >
                                <H4>Revenue from transactions</H4>
                                <div id="transChartContainer">
                                    <VictoryChart
                                        theme={VictoryTheme.grayscale}
                                        domainPadding={50}
                                        animate={{duration: 500}}
                                    >
                                        <VictoryAxis
                                            fixLabelOverlap
                                            style={{
                                                tickLabels: {
                                                    angle: 0,
                                                    fontSize: 15,
                                                    padding: 5
                                                }
                                            }}
                                        />
                                        <VictoryAxis
                                            dependentAxis
                                            style={{
                                                tickLabels: {
                                                    angle: 0,
                                                    fontSize: 15,
                                                    padding: 5
                                                }
                                            }}
                                        />
                                        {showLine ?
                                            <VictoryLine data={readableData()} x='created_at' y='total' />
                                            :
                                            <VictoryScatter data={readableData()} x='created_at' y='total' />
                                        }
                                    </VictoryChart>
                                </div>
                            </VerticalContainer>
                        }
                    </HorizontalContainer>
                    {showTable &&
                        <VerticalContainer alignItems="center" justifyContent="center">
                            <TransactionsTable items={aggregateItems()} transactions={data} distShown={showDistTable} transShown={showTransactionTable} totalShown={showTotal} sign={sign} before={before} />
                        </VerticalContainer>
                    }
                </VerticalContainer>
            :
                <H4
                    borderRadius="$5"
                    width="100%"
                    alignSelf="center"
                    boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                    padding="$3"
                >
                    No data available for this date
                </H4>
            }
        </VerticalContainer>
    )
}

export default React.memo(ViewReport);