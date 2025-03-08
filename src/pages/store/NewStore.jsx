import {useState} from "react";
import JoinStore from "../../components/store/JoinStore.jsx";
import CreateStore from "../../components/store/CreateStore.jsx";
import {YStack, Button} from "tamagui";
import {Edit3, PenSquare} from "@tamagui/lucide-icons";
import {EditContainer, SmallButtonWithAccent, VerticalContainer} from "../../tamagui.config.ts";

const NewStore = () => {
    const [joinStore, setJoinStore] = useState(true);

    return (
        <EditContainer>
        {joinStore ? <>
            <JoinStore />
            <SmallButtonWithAccent icon={Edit3} onClick={() => setJoinStore(false)}>Create Store</SmallButtonWithAccent>
        </> : <>
            <SmallButtonWithAccent icon={PenSquare} onClick={() => setJoinStore(true)}>Join Store</SmallButtonWithAccent>
            <CreateStore />
        </>}
        </EditContainer>
    );
}

export default NewStore;