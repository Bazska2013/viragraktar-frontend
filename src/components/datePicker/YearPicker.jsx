import {HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import {Button, SizableText} from "tamagui";
import {ChevronLeft, ChevronRight} from "@tamagui/lucide-icons";
import DateTable from "./DateTable.jsx";
import React, {useEffect, useState} from "react";

const YearPicker = (props) => {
    const [years, setYears] = useState(['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']);

    const findCurrentYears = () => {
        if (props.currentYear >= years.at(0)) {
            if (props.currentYear <= years.at(11)) {
                return;
            }
            handleYearsShift('up');
            findCurrentYears();
        }
        handleYearsShift('down');
        findCurrentYears();
    }

    useEffect(() => {
        findCurrentYears();
    }, []);

    const handleYearsShift = (direction) => {
        const newYears = years.map(year =>
            (direction === "down" ? parseInt(year) - 10 : parseInt(year) + 10).toString()
        );
        setYears(newYears);
        console.log(years);
    }

    return (
        <VerticalContainer animation='quickest' exitStyle={{opacity: 0}} enterStyle={{opacity: 1}}>
            <HorizontalContainer alignItems="center" justifyContent="space-between">
                <Button borderRadius="$10" size="$2" icon={ChevronLeft} onClick={() => handleYearsShift("down")} />
                <SizableText>{years.at(0) + " - " + years.at(11)}</SizableText>
                <Button borderRadius="$10" size="$2" icon={ChevronRight} onClick={() => handleYearsShift("up")} />
            </HorizontalContainer>
            <HorizontalContainer alignItems="center" justifyContent="space-between">
                <DateTable elements={years} selected={props.currentYear.toString()} setValue={props.setYear} />
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default React.memo(YearPicker);