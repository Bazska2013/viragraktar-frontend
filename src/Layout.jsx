import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import {YStack} from "tamagui";
import {VerticalContainer} from "./tamagui.config.ts";

export const Layout = () => {
    return (
        <YStack
            justifyContent="space-between"
        >
            <NavBar/>
            <VerticalContainer
                justifyContent="space-between"
            >
                <Outlet/>
            </VerticalContainer>
        </YStack>
    );
};