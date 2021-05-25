import styled from "styled-components";

import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const drawerWidth = 240;

// transition: theme.transitions.create(["width", "margin"], {
//   easing: theme.transitions.easing.sharp,
//   duration: theme.transitions.duration.leavingScreen,
// }),

export const NavbarContainer = styled(AppBar)`
  ${({ ...props }) => `
  margin-left: ${props.showsidebar ? drawerWidth : 0}px;
  width: calc(100% - ${props.showsidebar ? drawerWidth : 0}px);
  z-index: ${props.theme.zIndex.drawer + 1};
  transition: all ${props.theme.transitions.duration.leavingScreen}ms ${
    props.theme.transitions.easing.sharp
  };
  `}
`;

export const ToolbarLeft = styled(IconButton)`
  margin-right: 16px;
  color: white;
`;

export const ToolbarTitle = styled(Typography)`
  font-size: 1.3rem;
`;

export const ToolbarMiddle = styled.div`
  flex-grow: 1;
`;

export const ToolbarRightPC = styled.div`
  ${({ theme }) => `
  display: none;  
  @media screen and (min-width: ${theme.breakpoints.values.md}px) {
    display: flex;
  }
  `}
`;

export const ToolbarRightMobile = styled.div`
  ${({ theme }) => `
  display: flex;  
  @media screen and (min-width: ${theme.breakpoints.values.md}px) {
    display: none;
  }
  `}
`;
