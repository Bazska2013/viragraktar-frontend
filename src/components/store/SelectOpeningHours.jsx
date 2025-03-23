import SelectHours from "./SelectHours.jsx";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {XStack} from "tamagui";
import {HorizontalContainer} from "../../tamagui.config.ts";

const SelectOpeningHours = (props) => {
    const [openingHours, setOpeningHours] = useState(props.defaultValue ? JSON.parse(props.defaultValue) : {
        Mon: { from: "00:00", to: "00:00", closed: false },
        Tue: { from: "00:00", to: "00:00", closed: false },
        Wed: { from: "00:00", to: "00:00", closed: false },
        Thu: { from: "00:00", to: "00:00", closed: false },
        Fri: { from: "00:00", to: "00:00", closed: false },
        Sat: { from: "00:00", to: "00:00", closed: false },
        Sun: { from: "00:00", to: "00:00", closed: false },
    });

    useEffect(() => {
        props.setFieldValue('opening_hours', JSON.stringify(openingHours));
    }, [openingHours, props.setFieldValue]);

    const handleSelectFrom = (day, value) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], from: value }
        }));
    };

    const handleSelectTo = (day, value) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], to: value }
        }));
    };

    const handleClick = (day) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], closed: !prev[day].closed }
        }));
    };

    return (
        <HorizontalContainer flexWrap="wrap">
            {Object.keys(openingHours).map((day, index) => (
                <SelectHours
                    key={index}
                    day={day}
                    from={openingHours[day].from}
                    to={openingHours[day].to}
                    closed={openingHours[day].closed}
                    onSelectFrom={(e) => handleSelectFrom(day, e.target.value)}
                    onSelectTo={(e) => handleSelectTo(day, e.target.value)}
                    onClick={() => handleClick(day)}
                />
            ))}
        </HorizontalContainer>
    );
};

SelectOpeningHours.propTypes = {
    setFieldValue: PropTypes.func.isRequired,
};

export default SelectOpeningHours;