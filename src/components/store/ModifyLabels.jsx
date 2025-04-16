import {
    BigButton,
    HorizontalContainer,
    ProfileContainer,
    SmallButton,
    SmallButtonWithAccent,
    VerticalContainer
} from "../../tamagui.config.ts";
import {AnimatePresence, H2, H4, Input, Paragraph, Separator, SizableText, Spinner, Square} from "tamagui";
import {selectStore, createStore} from "../../features/store/storeSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {Plus, Save, SkipBack, X} from "@tamagui/lucide-icons";
import React, {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";

const ModifyLabels = () => {
    const store = useSelector(selectStore);
    const [labels, setLabels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [label, setLabel] = useState('');
    const [error, setError] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (store) {
            setLabels(JSON.parse(store.labels));
        }
    }, [store]);

    const handleAddLabel = () => {
        if (label.length > 0) {
            setLabels([...labels, label]);
            setLabel('');
        }
        setIsChanged(true);
    }

    const handleRemoveLabel = (label) => {
        setLabels(labels.filter((l) => l !== label));
        setIsChanged(true);
    }

    const handleSubmit = async () => {
        if (isChanged) {
            let response;
            setIsLoading(true);
            try {
                response = await axios.put('/api/store', {
                    labels: JSON.stringify(labels),
                });
            } catch (error) {
                setIsLoading(false);
                setError(error.response.data.message);
            } finally {
                setIsLoading(false);
                if (response?.status === 200) {
                    dispatch(createStore(response.data));
                    resetChanges();
                }
            }
        }
    }

    const resetChanges = () => {
        setLabels(JSON.parse(store.labels));
        setLabel('');
        setIsChanged(false);
    }

    return (
        <VerticalContainer>
            {isLoading ? <>
                <Spinner color="#292023">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </> : <VerticalContainer>
                <H2>Modify labels</H2>
                <ProfileContainer>
                    <H4>Available labels</H4>
                    <Square position="absolute" top={20} right={20} animation="quick" hoverStyle={{scale: 1.1}} pressStyle={{scale: 0.9}} scale={isChanged ? 1 : 0} opacity={isChanged ? 1 : 0} onClick={() => resetChanges()}>
                        <SkipBack size="$2" />
                    </Square>
                    <Paragraph>Click on the available labels listed below to remove them from your store. Items that already have the selected label will continue to have it. You have to manually remove them from the individual items.</Paragraph>
                    <HorizontalContainer flexWrap="wrap">
                        {labels && labels.map((label, index) => (
                            <SmallButton iconAfter={X} borderWidth={1} padding="$2" borderRadius="$5" key={label} onClick={() => handleRemoveLabel(label)} >{label}</SmallButton>
                        ))}
                    </HorizontalContainer>
                    <Separator/>
                    <H4>Add new label</H4>
                    <Paragraph>Type in a new label in the input field below and click the button next to it to add it to the available labels. Click the Save changes button below to save your modifications. If you wish to revert the changes made click the button in the top right corner.</Paragraph>
                    <HorizontalContainer alignItems="center">
                        <Input
                            backgroundColor="none"
                            flex={1}
                            borderWidth={2}
                            type="text"
                            name="label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                        <SmallButtonWithAccent icon={Plus} onClick={() => handleAddLabel()} />
                    </HorizontalContainer>
                    <BigButton disabled={!isChanged} icon={Save} onClick={() => handleSubmit()}>Save changes</BigButton>
                    {error && <SizableText color='red' >{error}</SizableText>}
                </ProfileContainer>
            </VerticalContainer>}
        </VerticalContainer>
    )
}

export default React.memo(ModifyLabels);