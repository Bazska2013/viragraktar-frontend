import {BigButton, HorizontalContainer, SmallButton, VerticalContainer} from "../../tamagui.config.ts";
import {H2, Input, YStack} from "tamagui";
import {Filter, FilterX, Search} from "lucide-react";
import React, {useEffect, useState} from "react";
import {selectStore} from "../../features/store/storeSlice.js";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";

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
    }, [selectedLabels, onLabelChange]);

    useEffect(() => {
        if (searchField.length > 0) {
            const filteredLabels = labels.filter((label) => label.toLowerCase().includes(searchField.toLowerCase()));
            setLabels(filteredLabels);
        } else {
            setLabels(JSON.parse(store.labels));
        }
    }, [searchField, store.labels]);

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
                        backgroundColor="white"
                        type="text"
                        name="search"
                        placeholder="Search..."
                        value={searchField}
                        onChange={handleChangeSearch}
                    />
                    <YStack position="absolute" right={10} top={12}>
                        <Search size={20} />
                    </YStack>
                </YStack>
                <BigButton size="$4" icon={searchOpen ? FilterX : Filter} onClick={() => handleChangeOpen()}>{searchOpen ? 'Remove filters' : 'Filter'}</BigButton>
            </HorizontalContainer>
            <HorizontalContainer animation="slow" alignItems="center" overflow="scroll" opacity={searchOpen ? 1 : 0} height={searchOpen ? "100%" : 0}>
                {labels.map((label) => (
                    <SmallButton marginLeft={5} marginRight={5} key={label} backgroundColor={isInSelection(label) ? '#FBF9EF' : '#f5f5f5'} focusStyle={{backgroundColor: '#FBF9EF'}} onClick={() => handleChangeLabel(label)} >{label}</SmallButton>
                ))}
            </HorizontalContainer>
        </VerticalContainer>
    )
}

FilterBar.propTypes = {
    title: PropTypes.string.isRequired,
    onTextChange: PropTypes.func.isRequired,
    onLabelChange: PropTypes.func.isRequired,
}

export default React.memo(FilterBar);