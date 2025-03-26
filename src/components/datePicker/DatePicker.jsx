import {Adapt, Button, Popover, SizableText} from "tamagui";
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {Calendar, ChevronLeft, ChevronRight} from "@tamagui/lucide-icons";
import {useEffect, useState} from "react";
import YearPicker from "./YearPicker.jsx";
import MonthPicker from "./MonthPicker.jsx";
import DayPicker from "./DayPicker.jsx";

const DatePicker = (props) => {
    const [date, setDate] = useState('');
    const [year, setYear] = useState(new Date ().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [day, setDay] = useState(new Date().getDate());
    const [currentSelector, setCurrentSelector] = useState('day');

    const handleDateChange = (value, type) => {
        switch (type) {
            case 'year':
                setYear(value);
                break;
            case 'month':
                setMonth(months.indexOf(value));
                break;
            case 'day':
                setDay(value);
                break;
        }
        setCurrentSelector('day');
    }

    const setToday = () => {
        setYear(new Date().getFullYear());
        setMonth(new Date().getMonth());
        setDay(new Date().getDate());
    }

    useEffect(() => {
        let newMonth = month+1;
        if (newMonth < 10) {
            newMonth = '0' + newMonth;
        }
        props.setValue(year + '-' + newMonth + '-' + day);
        setDate(year + '. ' + newMonth + '. ' + day + '.');
    }, [year, month, day]);

    return (
        <>
            <Popover size="$5" allowFlip stayInFrame offset={15} resize placement="bottom">
                <Popover.Trigger asChild>
                    <Button iconAfter={Calendar}>{date ? date : 'Select date'}</Button>
                </Popover.Trigger>

                <Popover.Content
                    borderWidth={1}
                    borderColor="$borderColor"
                    width={300}
                    height={300}
                    enterStyle={{ y: -10, opacity: 0 }}
                    exitStyle={{ y: -10, opacity: 0 }}
                    elevate
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                >
                    <Popover.Arrow />
                    <Popover.Close />
                    {/* ScrollView is optional, can just put any contents inside if not scrollable */}
                    {/*<Popover.ScrollView>/!* ... *!/</Popover.ScrollView>*/}
                    {/* ... */}
                    <VerticalContainer alignItems="center">
                        {currentSelector === 'month' ?
                        <MonthPicker currentMonth={month} setMonth={(value) => handleDateChange(value, 'month')} /> :
                        currentSelector === 'year' ?
                        <YearPicker currentYear={year} setYear={(value) => handleDateChange(value, 'year')} /> :
                        <>
                            <HorizontalContainer alignItems="center" justifyContent="space-between">
                                <SmallButtonWithAccent onClick={() => setCurrentSelector('year')}>{year.toString()}</SmallButtonWithAccent>
                                <SmallButtonWithAccent onClick={() => setCurrentSelector('month')}>{months[month]}</SmallButtonWithAccent>
                                <SmallButtonWithAccent onClick={() => setToday()}>Today</SmallButtonWithAccent>
                            </HorizontalContainer>
                            <DayPicker currentDay={day} currentMonth={month} currentYear={year} setDay={(value) => handleDateChange(value, 'day')} />
                        </>}
                    </VerticalContainer>
                </Popover.Content>

                {/* optionally change to sheet when small screen */}
                {/* you can also use <Popover.Adapt /> */}
                {/*<Adapt when="sm">*/}
                {/*    <Popover.Sheet>*/}
                {/*        <Popover.Sheet.Overlay />*/}
                {/*        <Popover.Sheet.Frame>*/}
                {/*            <Popover.Sheet.ScrollView>*/}
                {/*                <Adapt.Contents />*/}
                {/*            </Popover.Sheet.ScrollView>*/}
                {/*        </Popover.Sheet.Frame>*/}
                {/*    </Popover.Sheet>*/}
                {/*</Adapt>*/}
            </Popover>
        </>
    )
}

export default DatePicker;