import {Button, Popover, YStack} from "tamagui";
import {DateButton, HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import {Calendar, ChevronLeft, ChevronRight} from "lucide-react";
import React, {useEffect, useState} from "react";
import YearPicker from "./YearPicker.jsx";
import MonthPicker from "./MonthPicker.jsx";
import DayPicker from "./DayPicker.jsx";
import PropTypes from "prop-types";

const DatePicker = ({setValue}) => {
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

    const handleMonthShift = (direction) => {
        if (direction === 'up') {
            if (month === 11) {
                setMonth(0);
                setYear(parseInt(year) + 1);
            } else {
                setMonth(month + 1);
            }
        } else {
            if (month === 0) {
                setMonth(11);
                setYear(parseInt(year) - 1);
            } else {
                setMonth(month - 1);
            }
        }
        setDay(1);
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
        let newDay = day;
        if (newDay < 10) {
            newDay = '0' + newDay;
        }
        setValue(year + '-' + newMonth + '-' + newDay);
        setDate(year + '. ' + newMonth + '. ' + newDay + '.');
    }, [year, month, day, setValue]);

    return (
        <>
            <Popover size="$5" allowFlip stayInFrame offset={15} resize placement="bottom">
                <Popover.Trigger asChild>
                    <Button iconAfter={Calendar}>{date ? date : 'Select date'}</Button>
                </Popover.Trigger>

                <Popover.Content
                    borderWidth={1}
                    borderColor="$borderColor"
                    height={325}
                    width={350}
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
                    <VerticalContainer alignItems="center" width="100%">
                        <YStack opacity={currentSelector === 'month' ? 1 : 0} animation="quickest" position="absolute" zIndex={currentSelector === 'month' ? 100 : 0}>
                            <MonthPicker currentMonth={month} setMonth={(value) => handleDateChange(value, 'month')} />
                        </YStack>
                        <YStack opacity={currentSelector === 'year' ? 1 : 0} animation="quickest" position="absolute" zIndex={currentSelector === 'year' ? 100 : 0}>
                            <YearPicker currentYear={year} setYear={(value) => handleDateChange(value, 'year')} />
                        </YStack>
                        <VerticalContainer opacity={currentSelector === 'day' ? 1 : 0} position="absolute" animation="quickest" exitStyle={{opacity: 0}} enterStyle={{opacity: 1}} alignItems="center">
                            <HorizontalContainer alignItems="center" justifyContent="space-between">
                                <DateButton onClick={() => setCurrentSelector('year')}>{year.toString()}</DateButton>
                                <DateButton onClick={() => setCurrentSelector('month')}>{months[month]}</DateButton>
                                <DateButton onClick={() => setToday()}>Today</DateButton>
                            </HorizontalContainer>
                            <HorizontalContainer alignItems="center">
                                <Button onClick={() => {handleMonthShift('down')}} borderRadius="$10" size="$2" icon={ChevronLeft} />
                                <DayPicker currentDay={day} currentMonth={month} currentYear={parseInt(year)} setDay={(value) => handleDateChange(value, 'day')} />
                                <Button onClick={() => {handleMonthShift('up')}} borderRadius="$10" size="$2" icon={ChevronRight} />
                            </HorizontalContainer>
                        </VerticalContainer>
                    </VerticalContainer>
                </Popover.Content>
            </Popover>
        </>
    )
}

DatePicker.propTypes = {
    setValue: PropTypes.func.isRequired,
}

export default React.memo(DatePicker);