import {VerticalContainer} from "../../tamagui.config.ts";
import {H6} from "tamagui";
import DateTable from "./DateTable.jsx";

const MonthPicker = (props) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <VerticalContainer animation='quickest' exitStyle={{opacity: 0}} enterStyle={{opacity: 1}}>
            <H6 alignSelf="center">Select a month</H6>
            <DateTable elements={months} selected={months[props.currentMonth]} setValue={props.setMonth} />
        </VerticalContainer>
    )
}

export default MonthPicker;