import SelectHours from "./SelectHours.jsx";
import { useState, useEffect } from "react";

const SelectOpeningHours = ({ setFieldValue, defaultValue }) => {
    const [openingHours, setOpeningHours] = useState({
        Mon: { from: "00:00", to: "00:00", closed: false },
        Tue: { from: "00:00", to: "00:00", closed: false },
        Wed: { from: "00:00", to: "00:00", closed: false },
        Thu: { from: "00:00", to: "00:00", closed: false },
        Fri: { from: "00:00", to: "00:00", closed: false },
        Sat: { from: "00:00", to: "00:00", closed: false },
        Sun: { from: "00:00", to: "00:00", closed: false },
    });

    useEffect(() => {
        if (defaultValue) {
            setOpeningHours(JSON.parse(defaultValue));
        }
    }, [defaultValue]);

    useEffect(() => {
        // Convert openingHours to a JSON string and store it in Formik
        setFieldValue('opening_hours', JSON.stringify(openingHours));
    }, [openingHours, setFieldValue]);

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
        <>
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
        </>
    );
};

export default SelectOpeningHours;