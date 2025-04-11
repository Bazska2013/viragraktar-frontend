import {DateButton} from "../../tamagui.config.ts";
import React from "react";

const DateTable = (props) => {

    const rows = [];
    if (props.elements) {
        for (let i = 0; i < props.elements.length; i += 3) {
            rows.push(props.elements.slice(i, i+3));
        }
    }

    return (
        <table width="100%" style={{ textAlign: "center" }}>
            {props.days &&
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
            {props.days ?
                props.days.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td key={colIndex} style={{textAlign: "center"}}>
                                {cell ?
                                    <DateButton backgroundColor={props.selected === cell ? '#E1E89B' : ''} width='25px' padding="$3" borderRadius="$10" size="$1" onClick={() => props.setValue(cell)}>
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
                                    <DateButton backgroundColor={props.selected === cell ? '#E1E89B' : ''} width='100%' size="$3" onClick={() => props.setValue(cell)}>
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