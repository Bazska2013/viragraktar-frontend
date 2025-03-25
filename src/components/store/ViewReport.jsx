import {HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {H2, Input, SizableText} from "tamagui";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";
import {VictoryAxis, VictoryChart, VictoryLine, VictoryPie, VictoryTheme} from "victory";

const ViewReport = () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState('');
    const [items, setItems] = useState([]);

    const fetchDayData = async () => {
        let response;
        try {
            response = await axios.get('/api/transactions/' + date);
        } catch (error) {
            console.error(error);
        } finally {
            setData(response.data);
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
            acc[item.name] = (acc[item.name] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(itemCounts).map(name => ({
            name,
            count: itemCounts[name]
        }));
    }

    return (
        <VerticalContainer>
            <H2>View report</H2>
            <Input
                value={date}
                type='text'
                onChange={(e) => setDate(e.target.value)}
            />
            <SmallButtonWithAccent onClick={fetchDayData}>Fetch</SmallButtonWithAccent>
            <HorizontalContainer>
                <VictoryPie
                    data={aggregateItems()}
                    x="name"
                    y="count"
                    theme={VictoryTheme.clean}
                />
                <VictoryChart
                    theme={VictoryTheme.clean}
                >
                    <VictoryLine data={data} x='created_at' y='total' />
                </VictoryChart>
            </HorizontalContainer>
            {/*{items.map((item, index) => (*/}
            {/*    <SizableText key={index}>{item.name}</SizableText>*/}
            {/*))}*/}
        </VerticalContainer>
    )
}

export default ViewReport