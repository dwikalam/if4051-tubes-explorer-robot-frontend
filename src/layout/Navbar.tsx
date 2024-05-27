import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavigationItem = ({ to, text }: { to: string; text: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav-link fw-bold" : "nav-link")}
    >
      {text}
    </NavLink>
  );
};

const NavigationBar = () => {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" sticky="top">
        <Container>
          <Navbar.Brand>Explorer Robot</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-flex justify-content-between"
          >
            <Nav>
              <NavigationItem to="/stream" text="Stream" />
              <NavigationItem to="/explorations" text="Explorations" />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
};

export default NavigationBar;
