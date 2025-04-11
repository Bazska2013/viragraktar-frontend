import {HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "../../../tamagui.config.ts";
import {H6, Input, Separator, SizableText, Square} from "tamagui";
import {useSelector} from "react-redux";
import {selectStore} from "../../../features/store/storeSlice.js";
import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import {Plus, X} from "@tamagui/lucide-icons";

const Labels = ({value, id, onChange, isInvalid, combined}) => {
    const store = useSelector(selectStore);

    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState(value);
    const [searchField, setSearchField] = useState('');
    const [filteredLabels, setFilteredLabels] = useState([]);

    useEffect(() => {
        if (combined) {
            setSelectedLabels(value)
        }
    }, [value]);

    const handleAddToSelected = (label) => {
        if (!selectedLabels.includes(label)) {
            setSelectedLabels([...selectedLabels, label]);
            setLabels(labels.filter((l) => l !== label));
        }
    }

    const handleRemoveFromSelected = (label) => {
        if (selectedLabels.includes(label)) {
            setSelectedLabels(selectedLabels.filter((l) => l !== label));
            setLabels([...labels, label]);
        }
    }

    useEffect(() => {
        if (searchField.length > 0) {
            setFilteredLabels(labels.filter((label) => label.toLowerCase().includes(searchField.toLowerCase())));
        } else {
            setFilteredLabels(labels);
        }
    }, [searchField]);

    useEffect(() => {
        if (value !== selectedLabels) {
            onChange(selectedLabels);
        }
    }, [selectedLabels]);

    useEffect(() => {
        if (store) {
            setLabels(JSON.parse(store.labels));
            setFilteredLabels(JSON.parse(store.labels));
        }
    }, [store]);

    return (
        <VerticalContainer>
            <H6>Filter available labels</H6>
            <Input
                backgroundColor="none"
                type="text"
                value={searchField}
                onChange={e => {setSearchField(e.target.value)}}
            />
            <Separator />
            <H6>Available labels</H6>
            <HorizontalContainer flexWrap="wrap">
                {filteredLabels.map((label, index) => (
                    <SmallButton iconAfter={Plus} onClick={() => handleAddToSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label}>{label}</SmallButton>
                ))}
            </HorizontalContainer>
            <Separator />
            <H6>Selected labels</H6>
            <HorizontalContainer flexWrap="wrap">
                {selectedLabels && selectedLabels.map((label, index) => (
                    <SmallButtonWithAccent iconAfter={X} onClick={() => handleRemoveFromSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label}>{label}</SmallButtonWithAccent>
                ))}
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default React.memo(Labels);