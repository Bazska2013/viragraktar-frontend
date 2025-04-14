import {DateButton} from "../../tamagui.config.ts";
import React from "react";

const DateTable = ({elements, days, setValue, selected}) => {

    const rows = [];
    if (elements) {
        for (let i = 0; i < elements.length; i += 3) {
            rows.push(elements.slice(i, i+3));
        }
    }

    return (
        <table width="100%" style={{ textAlign: "center" }}>
            {days &&
                <thead>
                <tr>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                </tr>
                </thead>
            }
            <tbody>
            {days ?
                days.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td key={colIndex} style={{textAlign: "center"}}>
                                {cell ?
                                    <DateButton backgroundColor={selected === cell ? '#E1E89B' : ''} width='25px' padding="$3" borderRadius="$10" size="$1" onClick={() => setValue(cell)}>
                                        {cell}
                                    </DateButton>
                                    : ''
                                }
                            </td>
                        ))}
                    </tr>
                ))
            :
                rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} style={{padding: '5px'}}>
                                    <DateButton backgroundColor={selected === cell ? '#E1E89B' : ''} width='100%' size="$3" onClick={() => setValue(cell)}>
                                        {cell}
                                    </DateButton>
                                </td>
                            ))}
                        </tr>
                ))
            }
            </tbody>
        </table>
    )
}

export default React.memo(DateTable);