import {useState} from "react";
import JoinStore from "../../components/store/JoinStore.jsx";
import CreateStore from "../../components/store/CreateStore.jsx";
import {YStack, Button} from "tamagui";
import {Edit3, PenSquare} from "@tamagui/lucide-icons";

const NewStore = () => {
    const [joinStore, setJoinStore] = useState(true);

    return (
        <YStack
            flex={1}
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            gap="$2"
            padding="$2"
            justifyContent="space-between"
        >
        {joinStore ? <>
            <JoinStore />
            <Button icon={Edit3} size="$3" theme="accent" onClick={() => setJoinStore(false)}>Create Store</Button>
        </> : <>
            <Button icon={PenSquare} size="$3" theme="accent" onClick={() => setJoinStore(true)}>Join Store</Button>
            <CreateStore />
        </>}
        </YStack>
    );
}

export default NewStore;