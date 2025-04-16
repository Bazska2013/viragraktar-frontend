import DateTable from "./DateTable.jsx";
import React from "react";

const DayPicker = ({currentDay, currentMonth, currentYear, setDay}) => {

    const getDaysInMonth = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const calendarView = Array(firstDay).fill(null).concat(days);
        const weeks = [];
        while (calendarView.length) {
            weeks.push(calendarView.splice(0, 7));
        }
        return weeks;
    }

    const weeks = getDaysInMonth(currentMonth, currentYear);

    return (
        <DateTable days={weeks} selected={currentDay} setValue={setDay} />
    )
}

export default React.memo(DayPicker);