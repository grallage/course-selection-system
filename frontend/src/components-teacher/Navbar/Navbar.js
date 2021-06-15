import React from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  Show as showSidebar,
  Hidden as hiddenSidebar,
} from "../../redux/actions/sidebarAction";

// components
import { Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
import { NavbarContainer, NavbarMenu } from "./NavbarElements";
import { GrMenu } from "react-icons/gr";

const Navbar = () => {
  const sidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  // sidebar
  const handleSidebar = () => {
    dispatch(sidebar.display ? hiddenSidebar() : showSidebar());
  };

  return (
    <>
      <NavbarContainer expand="lg" showsidebar={sidebar.display ? 1 : 0}>
        <NavbarMenu onClick={handleSidebar}>
          <GrMenu />
        </NavbarMenu>
        <NavbarContainer.Toggle aria-controls="basic-navbar-nav" />
        <NavbarContainer.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </NavbarContainer.Collapse>
      </NavbarContainer>
    </>
  );
};

export default Navbar;
