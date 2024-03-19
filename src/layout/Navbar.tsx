import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavigationBar = () => {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" sticky="top">
        <Container>
          <Navbar.Brand>Dashboard</Navbar.Brand>
          <Nav className="me-auto">
          </Nav>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
};

export default NavigationBar;
