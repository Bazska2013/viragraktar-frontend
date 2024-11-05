import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

export const Layout = () => {
    return (
        <Container>
            <NavBar/>
            <Outlet/>
        </Container>
    );
};