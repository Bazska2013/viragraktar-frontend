import { Col, Container, Row, Form } from "react-bootstrap";
import {Checkbox, Group, H4, H5, Label, YStack} from "tamagui";
import {Check} from "@tamagui/lucide-icons";
import {HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";

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
            <HorizontalContainer flex={1} alignItems="center">
                <Label flex={6} htmlFor={props.day + 'closed'}>
                    <H5>Closed</H5>
                </Label>
                <Checkbox flex={1} id={props.day + 'closed'} name={props.day + 'closed'} /*size="$3"*/ checked={!!props.closed} onCheckedChange={props.onClick}>
                    <Checkbox.Indicator>
                        <Check />
                    </Checkbox.Indicator>
                </Checkbox>
            </HorizontalContainer>
        </VerticalContainer>
    );
}

export default SelectHours;