import { Col, Container, Row, Form } from "react-bootstrap";
import {Checkbox, Group, H4, Label, YStack} from "tamagui";
import {Check} from "@tamagui/lucide-icons";
import {VerticalContainer} from "../../tamagui.config.ts";

const SelectHours = (props) => {
    return (
        <VerticalContainer>
            <H4>
                {props.day}
            </H4>
            <Group orientation="vertical">
                    <Form.Select value={props.from} onChange={props.onSelectFrom}>
                        <option>00:00</option>
                        <option>01:00</option>
                        <option>02:00</option>
                        <option>03:00</option>
                        <option>04:00</option>
                        <option>05:00</option>
                        <option>06:00</option>
                        <option>07:00</option>
                        <option>08:00</option>
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>12:00</option>
                        <option>13:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                        <option>17:00</option>
                        <option>18:00</option>
                        <option>19:00</option>
                        <option>20:00</option>
                        <option>21:00</option>
                        <option>22:00</option>
                        <option>23:00</option>
                    </Form.Select>
                    <Form.Select value={props.to} onChange={props.onSelectTo}>
                        <option>00:00</option>
                        <option>01:00</option>
                        <option>02:00</option>
                        <option>03:00</option>
                        <option>04:00</option>
                        <option>05:00</option>
                        <option>06:00</option>
                        <option>07:00</option>
                        <option>08:00</option>
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>12:00</option>
                        <option>13:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                        <option>17:00</option>
                        <option>18:00</option>
                        <option>19:00</option>
                        <option>20:00</option>
                        <option>21:00</option>
                        <option>22:00</option>
                        <option>23:00</option>
                    </Form.Select>
            </Group>
            <Label htmlFor="closed">Closed</Label>
            <Checkbox id="closed" name="closed" /*size="$3"*/ checked={!!props.closed} onCheckedChange={props.onClick}>
                <Checkbox.Indicator>
                    <Check />
                </Checkbox.Indicator>
            </Checkbox>
        </VerticalContainer>
    );
}

export default SelectHours;