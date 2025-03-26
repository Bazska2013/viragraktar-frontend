import {useState} from "react";
import {VerticalContainer} from "../../tamagui.config.ts";
import {H6} from "tamagui";
import DateTable from "./DateTable.jsx";

const MonthPicker = (props) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <VerticalContainer>
            <H6 alignSelf="center">Select a month</H6>
            <DateTable elements={months} selected={props.currentMonth} setValue={props.setMonth} />
        </VerticalContainer>
    )
}

export default MonthPicker;