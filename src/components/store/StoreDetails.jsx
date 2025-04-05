import {ClipboardCopy} from "@tamagui/lucide-icons";
import {HorizontalContainer, ProfileContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";
import {H2, H4, Separator, SizableText} from "tamagui";
import {useEffect, useState} from "react";
import axios from "../../axiosConfig.js";

const StoreDetails = (props) => {
    const openingHours = JSON.parse(props.store.opening_hours);
    const [storeId, setStoreId] = useState(null);
    const [copied, setCopied] = useState(false);

    const getStoreId = async () => {
        let response;
        try {
            response = await axios.get('/api/store/id');
        } catch (error) {
            console.log(error);
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
                <SizableText>{props.store.name}</SizableText>
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
                <H4>Is calculation enabled?</H4>
                <SizableText>{props.store.calculation_enabled ? 'Yes' : 'No'}</SizableText>
                <Separator />
                <H4>Click the button to copy the Store ID</H4>
                <SmallButtonWithAccent icon={ClipboardCopy} onPress={copyToClipboard}>{copied? 'Copied!' : storeId}</SmallButtonWithAccent>
            </ProfileContainer>
        </VerticalContainer>
    )
}

export default StoreDetails;