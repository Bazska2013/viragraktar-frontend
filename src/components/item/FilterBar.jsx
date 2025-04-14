import {HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {AnimatePresence, H2, Input, Square, YStack} from "tamagui";
import {Filter, FilterX, Search, X} from "@tamagui/lucide-icons";
import React, {useEffect, useState} from "react";
import {selectStore} from "../../features/store/storeSlice.js";
import {useSelector} from "react-redux";

const FilterBar = ({title, onTextChange, onLabelChange}) => {
    const store = useSelector(selectStore);
    const [labels, setLabels] = useState(JSON.parse(store?.labels));
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchField, setSearchField] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);

    const handleChangeOpen = () => {
        if (searchOpen) {
            setSearchOpen(false);
            setSearchField('');
            setSelectedLabels([]);
        } else {
            setSearchOpen(true);
        }
    }

    const handleChangeSearch = (e) => {
        setSearchField(e.target.value);
        onTextChange(e.target.value);
    }

    const handleChangeLabel = (label) => {
        if (selectedLabels.includes(label)) {
            removeLabel(label);
        } else {
            addLabel(label);
        }
    }

    useEffect(() => {
        onLabelChange(selectedLabels);
    }, [selectedLabels]);

    useEffect(() => {
        if (searchField.length > 0) {
            const filteredLabels = labels.filter((label) => label.toLowerCase().includes(searchField.toLowerCase()));
            setLabels(filteredLabels);
        } else {
            setLabels(JSON.parse(store.labels));
        }
    }, [searchField]);

    const addLabel = (label) => {
        setSelectedLabels([...selectedLabels, label]);
    }

    const removeLabel = (label) => {
        setSelectedLabels(selectedLabels.filter((item) => item !== label));
    }

    const isInSelection = (label) => {
        return selectedLabels.includes(label);
    }

    return (
        <VerticalContainer animation="medium" marginLeft={10} marginRight={10} height={searchOpen ? '150px' : '50px'}>
            <HorizontalContainer height="50px" alignItems="center" justifyContent="space-between">
                <H2>{title}</H2>
                <YStack animation="quick" scale={searchOpen ? 1 : 0} opacity={searchOpen ? 1 : 0} width={searchField.length * 10} minWidth="200px" maxWidth="50%">
                    <Input
                        backgroundColor="none"
                        type="text"
                        name="search"
                        placeholder="Search..."
                        value={searchField}
                        onChange={handleChangeSearch}
                    />
                    <Search position="absolute" size="$1" right={10} top={12} />
                </YStack>
                <SmallButton icon={searchOpen ? FilterX : Filter} onClick={() => handleChangeOpen()}>{searchOpen ? 'Remove filters' : 'Filter'}</SmallButton>
            </HorizontalContainer>
            <HorizontalContainer animation="slow" alignItems="center" overflow="scroll" opacity={searchOpen ? 1 : 0} height={searchOpen ? "100%" : 0}>
                {labels.map((label, index) => (
                    <SmallButton marginLeft={5} marginRight={5} key={label} backgroundColor={isInSelection(label) ? '#FBF9EF' : '#f5f5f5'} focusStyle={{backgroundColor: '#FBF9EF'}} onClick={() => handleChangeLabel(label)} >{label}</SmallButton>
                ))}
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default React.memo(FilterBar);