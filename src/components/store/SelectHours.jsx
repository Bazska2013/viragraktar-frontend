import {Form} from "react-bootstrap";
import {Checkbox, Group, H4, H5, Label} from "tamagui";
import {Check} from "@tamagui/lucide-icons";
import {HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import React from "react";

const SelectHours = ({day, from, onSelectFrom, to, onSelectTo, closed, onClick}) => {
    return (
        <VerticalContainer>
            <H4>
                {day}
            </H4>
            <Group orientation="vertical">
                    <Form.Select value={from} onChange={onSelectFrom}>
                        <option>0:0</option>
                        <option>0:30</option>
                        <option>1:0</option>
                        <option>1:30</option>
                        <option>2:0</option>
                        <option>2:30</option>
                        <option>3:0</option>
                        <option>3:30</option>
                        <option>4:0</option>
                        <option>4:30</option>
                        <option>5:0</option>
                        <option>5:30</option>
                        <option>6:0</option>
                        <option>6:30</option>
                        <option>7:0</option>
                        <option>7:30</option>
                        <option>8:0</option>
                        <option>8:30</option>
                        <option>9:0</option>
                        <option>9:30</option>
                        <option>10:0</option>
                        <option>10:30</option>
                        <option>11:0</option>
                        <option>11:30</option>
                        <option>12:0</option>
                        <option>12:30</option>
                        <option>13:0</option>
                        <option>13:30</option>
                        <option>14:0</option>
                        <option>14:30</option>
                        <option>15:0</option>
                        <option>15:30</option>
                        <option>16:0</option>
                        <option>16:30</option>
                        <option>17:0</option>
                        <option>17:30</option>
                        <option>18:0</option>
                        <option>18:30</option>
                        <option>19:0</option>
                        <option>19:30</option>
                        <option>20:0</option>
                        <option>20:30</option>
                        <option>21:0</option>
                        <option>21:30</option>
                        <option>22:0</option>
                        <option>22:30</option>
                        <option>23:0</option>
                        <option>23:30</option>
                    </Form.Select>
                    <Form.Select value={to} onChange={onSelectTo}>
                        <option>0:0</option>
                        <option>0:30</option>
                        <option>1:0</option>
                        <option>1:30</option>
                        <option>2:0</option>
                        <option>2:30</option>
                        <option>3:0</option>
                        <option>3:30</option>
                        <option>4:0</option>
                        <option>4:30</option>
                        <option>5:0</option>
                        <option>5:30</option>
                        <option>6:0</option>
                        <option>6:30</option>
                        <option>7:0</option>
                        <option>7:30</option>
                        <option>8:0</option>
                        <option>8:30</option>
                        <option>9:0</option>
                        <option>9:30</option>
                        <option>10:0</option>
                        <option>10:30</option>
                        <option>11:0</option>
                        <option>11:30</option>
                        <option>12:0</option>
                        <option>12:30</option>
                        <option>13:0</option>
                        <option>13:30</option>
                        <option>14:0</option>
                        <option>14:30</option>
                        <option>15:0</option>
                        <option>15:30</option>
                        <option>16:0</option>
                        <option>16:30</option>
                        <option>17:0</option>
                        <option>17:30</option>
                        <option>18:0</option>
                        <option>18:30</option>
                        <option>19:0</option>
                        <option>19:30</option>
                        <option>20:0</option>
                        <option>20:30</option>
                        <option>21:0</option>
                        <option>21:30</option>
                        <option>22:0</option>
                        <option>22:30</option>
                        <option>23:0</option>
                        <option>23:30</option>
                    </Form.Select>
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