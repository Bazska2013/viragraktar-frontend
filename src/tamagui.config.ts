import { themes } from './themes'
import { defaultConfig } from '@tamagui/config/v4'
import {createTamagui} from "@tamagui/core";
import {Button, Group, ListItem, styled, XStack, YStack} from "tamagui";

export const BigButton = styled(Button, {
    backgroundColor: '#292023',
    color: 'white',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    hoverStyle: {
        backgroundColor: '#392D31',
    },
    focusStyle: {
        backgroundColor: '#392D31',
    },
    pressStyle: {
        backgroundColor: '#838072'
    },
    disabledStyle: {
        backgroundColor: '#44363A',
        border: 'none',
    },
    size: "$6",
});

export const SmallButtonWithAccent = styled(Button, {
    backgroundColor: '#FBF9EF',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    hoverStyle: {
        backgroundColor: '#faf0e6',
    },
    focusStyle: {
        backgroundColor: '#faf5eb',
    },
    pressStyle: {
        backgroundColor: '#f5ebe1'
    },
    disabledStyle: {
        backgroundColor: '#fffaf5',
        border: 'none',
    },
    size: "$3",
});

export const SmallButton = styled(Button, {
    backgroundColor: '#f5f5f5',
    color: 'black',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    hoverStyle: {
        backgroundColor: '#f0f0f0',
    },
    focusStyle: {
        backgroundColor: '#f3f3f3',
    },
    pressStyle: {
        backgroundColor: '#f1f1f1'
    },
    disabledStyle: {
        backgroundColor: '#fafafa',
        border: 'none',
    },
    size: "$3",
});

export const DateButton = styled(Button, {
    backgroundColor: 'white',
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    color: 'black',
    hoverStyle: {
        backgroundColor: '#fafbee',
    },
    focusStyle: {
        backgroundColor: '#E1E89B',
    },
    pressStyle: {
        backgroundColor: '#F0F3CD'
    },

})

export const VerticalContainer = styled(YStack, {
    flex: 1,
    gap: "$5",
    padding: "$1",
});

export const HorizontalContainer = styled(XStack, {
    flex: 1,
    gap: "$5",
    padding: "$1",
});

export const EditContainer = styled(YStack, {
    flex: 1,
    gap: "$5",
    padding: "$1",
    borderRadius: "$3",
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    alignSelf: 'center',
});

export const ProfileContainer = styled(YStack, {
    borderRadius: "$5",
    width: "100%",
    alignSelf: "center",
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
    padding:"$3",
    flex: 1,
    gap: "$5",
})

export const StyledListItem = styled(ListItem, {
    backgroundColor: '#ffffff',
    pressStyle: {
        backgroundColor: '#fafafa',
    }
});

export const StyledGroup = styled(Group, {
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
})

export const config = createTamagui({
    themes,
    ...defaultConfig,
})
