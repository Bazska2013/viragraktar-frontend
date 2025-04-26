import {Form} from "react-bootstrap";
import {Checkbox, Group, H4, H5, H6, Input, Label} from "tamagui";
import {Check} from "@tamagui/lucide-icons";
import {HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import React, {useEffect, useState, useCallback} from "react";

const SelectHours = ({day, from, onSelectFrom, to, onSelectTo, closed, onClick}) => {
    const [fromHour, setFromHour] = useState('00');
    const [fromMinute, setFromMinute] = useState('00');
    const [toHour, setToHour] = useState('00');
    const [toMinute, setToMinute] = useState('00');

    const handleFromHourChange = useCallback((value) => {
        if (Number(value) < 24) {
            setFromHour(value);
        }
    }, []);

    const handleFromHourBlur = useCallback(() => {
        if (fromHour.length === 0) {
            setFromHour('00');
        }
        if (fromHour.length === 1) {
            setFromHour('0' + fromHour);
        }
        if (fromHour.length > 2) {
            setFromHour(fromHour.slice(fromHour.length-2, fromHour.length));
        }
        onSelectFrom(fromHour + ':' + fromMinute);
    }, [fromHour, fromMinute, onSelectFrom]);

    const handleFromMinuteChange = useCallback((value) => {
        if (Number(value) < 60) {
            setFromMinute(value);
        }
    }, []);

    const handleFromMinuteBlur = useCallback(() => {
        if (fromMinute.length === 0) {
            setFromMinute('00');
        }
        if (fromMinute.length === 1) {
            setFromMinute('0' + fromMinute);
        }
        if (fromMinute.length > 2) {
            setFromMinute(fromMinute.slice(fromMinute.length-2, fromMinute.length));
        }
        onSelectFrom(fromHour + ':' + fromMinute);
    }, [fromHour, fromMinute, onSelectFrom]);

    const handleToHourChange = useCallback((value) => {
        if (Number(value) < 24) {
            setToHour(value);
        }
    }, []);

    const handleToHourBlur = useCallback(() => {
        if (toHour.length === 0) {
            setToHour('00');
        }
        if (toHour.length === 1) {
            setToHour('0' + toHour);
        }
        if (toHour.length > 2) {
            setToHour(toHour.slice(toHour.length-2, toHour.length));
        }
        onSelectTo(toHour + ':' + toMinute);
    }, [toHour, toMinute, onSelectTo]);

    const handleToMinuteChange = useCallback((value) => {
        if (Number(value) < 60) {
            setToMinute(value);
        }
    }, []);

    const handleToMinuteBlur = useCallback(() => {
        if (toMinute.length === 0) {
            setToMinute('00');
        }
        if (toMinute.length === 1) {
            setToMinute('0' + toMinute);
        }
        if (toMinute.length > 2) {
            setToMinute(toMinute.slice(toMinute.length-2, toMinute.length));
        }
        onSelectTo(toHour + ':' + toMinute);
    }, [toHour, toMinute, onSelectTo]);

    useEffect(() => {
        let [hour, minute] = from.split(':');
        if (hour.length === 1) {
            hour = '0' + hour;
        }
        if (minute.length === 1) {
            minute = '0' + minute;
        }
        setFromHour(hour);
        setFromMinute(minute);
        [hour, minute] = to.split(':');
        if (hour.length === 1) {
            hour = '0' + hour;
        }
        if (minute.length === 1) {
            minute = '0' + minute;
        }
        setToHour(hour);
        setToMinute(minute);
    }, []);

    return (
        <VerticalContainer>
            <H4>
                {day}
            </H4>
            <Group orientation="vertical">
                <H6>From</H6>
                <Group orientation="horizontal">
                    <Input
                        textAlign="center"
                        width={10}
                        backgroundColor="white"
                        flex={1}
                        borderWidth={2}
                        type='number'
                        name='from.hour'
                        id="from.hour"
                        value={fromHour}
                        onChange={(e) => handleFromHourChange(e.target.value)}
                        onBlur={handleFromHourBlur}
                    />
                    <Input
                        textAlign="center"
                        width={10}
                        backgroundColor="white"
                        flex={1}
                        borderWidth={2}
                        type='number'
                        name='from.minute'
                        id="from.minute"
                        value={fromMinute}
                        onChange={(e) => handleFromMinuteChange(e.target.value)}
                        onBlur={handleFromMinuteBlur}
                    />
                </Group>
                <H6>To</H6>
                <Group orientation="horizontal">
                    <Input
                        textAlign="center"
                        width={10}
                        backgroundColor="white"
                        flex={1}
                        borderWidth={2}
                        type='number'
                        name='to.hour'
                        id="to.hour"
                        value={toHour}
                        onChange={(e) => handleToHourChange(e.target.value)}
                        onBlur={handleToHourBlur}
                    />
                    <Input
                        textAlign="center"
                        width={10}
                        backgroundColor="white"
                        flex={1}
                        borderWidth={2}
                        type='number'
                        name='to.minute'
                        id="to.minute"
                        value={toMinute}
                        onChange={(e) => handleToMinuteChange(e.target.value)}
                        onBlur={handleToMinuteBlur}
                    />
                </Group>
            </Group>
            <HorizontalContainer flex={1} alignItems="center">
                <Label flex={6} htmlFor={day + 'closed'}>
                    <H5>Closed</H5>
                </Label>
                <Checkbox flex={1} id={day + 'closed'} name={day + 'closed'} checked={!!closed} onCheckedChange={onClick}>
                    <Checkbox.Indicator>
                        <Check />
                    </Checkbox.Indicator>
                </Checkbox>
            </HorizontalContainer>
        </VerticalContainer>
    );
}

export default React.memo(SelectHours);