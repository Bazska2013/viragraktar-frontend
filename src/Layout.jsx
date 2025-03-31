import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import {YStack} from "tamagui";
import {VerticalContainer} from "./tamagui.config.ts";

export const Layout = () => {
    return (
        <YStack
            justifyContent="space-between"
        >
            <NavBar justifyContent="center" />
            <VerticalContainer
                justifyContent="space-between"
                marginTop={"5rem"}
            >
                <Outlet/>
            </VerticalContainer>
        </YStack>
    );
};