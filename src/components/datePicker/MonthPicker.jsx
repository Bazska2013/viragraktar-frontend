import {VerticalContainer} from "../../tamagui.config.ts";
import {H6} from "tamagui";
import DateTable from "./DateTable.jsx";
import React from "react";

const MonthPicker = ({currentMonth, setMonth}) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <VerticalContainer animation='quickest' exitStyle={{opacity: 0}} enterStyle={{opacity: 1}}>
            <H6 alignSelf="center">Select a month</H6>
            <DateTable elements={months} selected={months[currentMonth]} setValue={setMonth} />
        </VerticalContainer>
    )
}

export default React.memo(MonthPicker);