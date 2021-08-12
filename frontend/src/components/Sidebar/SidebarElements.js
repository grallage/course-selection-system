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
    className={className}
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

// export const SidebarLink = styled(Link)`
//   color: inherit;
//   text-decoration: none;
// `;
