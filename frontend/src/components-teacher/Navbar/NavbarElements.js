import styled from "styled-components/macro";

import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

const DEFAULT_WIDTH = "250px";

// width: calc(100% - ${props.showsidebar ? drawerWidth : 0}px);
// width: ${props.showsidebar ? `calc(100% - ${DEFAULT_WIDTH})` : `100%`};
export const NavbarContainer = styled(Navbar)`
  ${({ ...props }) => `
  margin-left: ${props.showsidebar ? DEFAULT_WIDTH : 0};
  width: calc(100% - ${props.showsidebar ? DEFAULT_WIDTH : "0px"});
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  color: #1f2d3d;
  transition: width 1000ms ease, margin-left 1000ms ease;
  border-bottom: 1px solid #dee2e6;
  max-height: 57px;
  z-index: 999;
  `}
`;

export const NavbarMenu = styled(Navbar.Brand)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 2.5rem;
  transition: width 300ms ease;
`;
