import {ClipboardCopy} from "@tamagui/lucide-icons";
import {HorizontalContainer, ProfileContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {H2, H4, Separator, SizableText} from "tamagui";
import React, {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";

const StoreDetails = ({store, sign}) => {
    const openingHours = JSON.parse(store ? store.opening_hours : '{}');
    const [storeId, setStoreId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const getStoreId = async () => {
        let response;
        try {
            response = await axios.get('/api/store/id');
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setStoreId(response.data);
            }
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            getStoreId();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        getStoreId();
    }, []);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(storeId);
        setCopied(true);
        const intervalId = setInterval(() => {
            setCopied(false);
        }, 2000);

        return () => clearInterval(intervalId);
    };

    return (
        <VerticalContainer>
            <H2>Store details</H2>
            <ProfileContainer>
                <H4>Store name</H4>
                <SizableText>{store?.name}</SizableText>
                <Separator />
                <H4>Opening hours</H4>
                <HorizontalContainer flexWrap="wrap">
                    {Object.keys(openingHours).map((day) => (
                        <VerticalContainer key={day}>
                            <H4>{day}</H4>
                            <SizableText>{openingHours[day].closed ? 'Closed' : 'From ' + openingHours[day].from + ' - To ' + openingHours[day].to}</SizableText>
                        </VerticalContainer>
                    ))}
                </HorizontalContainer>
                <Separator />
                <H4>Currency used</H4>
                <SizableText>{sign}</SizableText>
                <Separator />
                <H4>Click the button to copy the Store ID</H4>
                <SmallButtonWithAccent icon={ClipboardCopy} onPress={copyToClipboard}>{copied? 'Copied!' : storeId}</SmallButtonWithAccent>
            </ProfileContainer>
        </VerticalContainer>
    )
}

export default React.memo(StoreDetails);