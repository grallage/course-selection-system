import styled from "styled-components/macro";
import { Navbar } from "react-bootstrap";

export const NavbarContainer = styled(Navbar)`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  /* background-color: #0d6efd;
  color: #fff; */
  transition: width 1000ms ease, margin-left 1000ms ease;
  border-bottom: 1px solid #dee2e6;
  z-index: 999;

  & .nav-link.navbar-text {
    cursor: pointer;
  }
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
