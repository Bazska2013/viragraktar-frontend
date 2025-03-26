import {HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import {Button, H6, SizableText} from "tamagui";
import {ChevronLeft, ChevronRight} from "@tamagui/lucide-icons";
import DateTable from "./DateTable.jsx";
import {useEffect, useState} from "react";

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
        <VerticalContainer>
            <HorizontalContainer alignItems="center">
                <Button icon={ChevronLeft} onClick={() => handleYearsShift("down")} />
                <SizableText>{years.at(0) + " - " + years.at(11)}</SizableText>
                <Button icon={ChevronRight} onClick={() => handleYearsShift("up")} />
            </HorizontalContainer>
            <HorizontalContainer alignItems="center">
                <DateTable elements={years} selected={props.currentYear} setValue={props.setYear} />
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default YearPicker;