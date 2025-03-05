import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import {YStack} from "tamagui";

export const Layout = () => {
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
            <NavBar/>
            <YStack
                flex={1}
                borderWidth={2}
                borderColor="$color"
                borderRadius="$4"
                gap="$2"
                padding="$2"
                justifyContent="space-between"
            >
                <Outlet/>
            </YStack>
        </YStack>
    );
};