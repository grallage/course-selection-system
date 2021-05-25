import Drawer from "@material-ui/core/Drawer";
import styled from "styled-components";

const drawerWidth = 240;

export const SidebarContainer = styled.div`
  display: flex;
`;

export const SidebarWrapper = styled(({ children, className, ...props }) => (
  <Drawer
    id="sidebarwrapper"
    variant="permanent"
    classes={{ paper: className }}
  >
    {children}
  </Drawer>
))`
  ${({ ...props }) =>
    props.showsidebar
      ? `
width:${drawerWidth}px;
flex-shrink:0;
white-space:nowrap;
transition: width ${props.theme.transitions.duration.leavingScreen}ms ${props.theme.transitions.easing.sharp},
            margin ${props.theme.transitions.duration.leavingScreen}ms ${props.theme.transitions.easing.sharp};
`
      : `
width: ${props.theme.spacing(7) + 1}px;
flex-shrink:0;
white-space:nowrap;
overflow-x: hidden;
transition: 
    width ${props.theme.transitions.duration.leavingScreen}ms ${
          props.theme.transitions.easing.sharp
        },
    margin ${props.theme.transitions.duration.leavingScreen}ms ${
          props.theme.transitions.easing.sharp
        };
@media screen and (min-width: ${props.theme.breakpoints.values.sm}px) {
    width: ${props.theme.spacing(9) + 1}px;
  }
`}
`;

export const SidebarToolbar = styled.div`
  ${({ theme }) => `
display: flex;
align-items: center;
justify-content: flex-end;
padding: ${theme.spacing(0, 1)}px;
min-height: 56px;
@media (min-width:0px) and (orientation: landscape) {
    min-height: 48px;
}
@media (min-width:600px) {
    min-height: 64px;
}
  `}
`;
