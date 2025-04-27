import {HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "../../../tamagui.config.ts";
import {H6, Input, Separator} from "tamagui";
import {useSelector} from "react-redux";
import {selectStore} from "../../../features/store/storeSlice.js";
import React, {useEffect, useState} from "react";
import {Plus, X} from "@tamagui/lucide-icons";
import PropTypes from "prop-types";

const Labels = ({value, onChange, combined}) => {
    const store = useSelector(selectStore);

    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState(value);
    const [searchField, setSearchField] = useState('');
    const [filteredLabels, setFilteredLabels] = useState([]);

    useEffect(() => {
        if (combined) {
            setSelectedLabels(value)
        }
    }, [combined, value]);

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
    }, [labels, searchField]);

    useEffect(() => {
        if (value !== selectedLabels) {
            onChange(selectedLabels);
        }
    }, [selectedLabels, onChange]);

    useEffect(() => {
        if (store) {
            const allLabels = JSON.parse(store.labels);
            const filteredLabels = allLabels.filter(label => !selectedLabels.includes(label));
            setLabels(filteredLabels);
            setFilteredLabels(filteredLabels);
        }
    }, [store, selectedLabels]);

    return (
        <VerticalContainer>
            <H6>Filter available labels</H6>
            <Input
                backgroundColor="none"
                type="text"
                value={searchField}
                onChange={e => {setSearchField(e.target.value)}}
                placeholder="Search for labels..."
            />
            <Separator />
            <H6>Available labels</H6>
            <HorizontalContainer flexWrap="wrap">
                {filteredLabels.map((label) => (
                    <SmallButton iconAfter={Plus} onClick={() => handleAddToSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label}>{label}</SmallButton>
                ))}
            </HorizontalContainer>
            <Separator />
            <H6>Selected labels</H6>
            <HorizontalContainer flexWrap="wrap">
                {selectedLabels && selectedLabels.map((label) => (
                    <SmallButtonWithAccent iconAfter={X} onClick={() => handleRemoveFromSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label}>{label}</SmallButtonWithAccent>
                ))}
            </HorizontalContainer>
        </VerticalContainer>
    )
}

Labels.propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    combined: PropTypes.bool
}

export default React.memo(Labels);