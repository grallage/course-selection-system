import styled from "styled-components/macro";

import { Card, ListGroup } from "react-bootstrap";

const DEFAULT_WIDTH = "250px";
const default_BG = "#343a40";
const default_FONT_COLOR = "rgba(255,255,255,.8)";
const DEFAULT_BORDER_COLOR = "#4f5962";

export const SidebarContainer = styled.aside`
  ${({ ...props }) => `
//   position: fixed;
//   left: 0;
//   top: 0;
  overflow-y: hidden;
  // position: relative;
  min-height: 100vh;
  box-shadow: 0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22);
  flex-shrink:0;
//   white-space:nowrap;
  
  width: ${props.showsidebar ? DEFAULT_WIDTH : 0};
  background-color: ${default_BG};
  transition: width 1000ms ease;
  
  & .list-group-item {
    white-space: ${props.showsidebar ? "wrap" : "nowrap"};;
    opacity: ${props.showsidebar ? "100%" : "0"};
    // transition: opacity 3000ms ${props.showsidebar ? "ease-out" : "ease-in"};
    transition: opacity 1000ms cubic-bezier(0.55, 0.06, 0.68, 0.19);
  }
  `}
`;

export const SidebarCard = styled(Card)`
  background-color: inherit;
  color: ${default_FONT_COLOR};

  & .list-group {
    border-bottom: 1px solid ${DEFAULT_BORDER_COLOR};
  }
`;

export const SidebarBody = styled.div`
  padding: 0 10px;
`;

export const SidebarCardHeader = styled(Card.Header)`
  white-space: nowrap;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  width: 248px;
  font-size: 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid ${DEFAULT_BORDER_COLOR};
  & svg {
    margin: 0 10px 0 0;
    font-size: 2rem;
  }
`;
export const SidebarItemGroup = styled(ListGroup)``;
export const SidebarItem = styled(ListGroup.Item)`
  text-decoration: none;
  background-color: inherit;
  color: ${default_FONT_COLOR};
  border-bottom: 0;
  padding-left: 1rem;
`;
export const SidebarHeader = styled(SidebarItem)`
  padding-left: 0;
`;
