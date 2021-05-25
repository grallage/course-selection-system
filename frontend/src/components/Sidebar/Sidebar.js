import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

// redux
import { useDispatch, useSelector } from "react-redux";
import { Hidden as hiddenSidebar } from "../../redux/actions/sidebarAction";
import {
  SidebarContainer,
  SidebarToolbar,
  SidebarWrapper,
} from "./SidebarElements";

import dataList from "./data";

const drawerWidth = 240;

export default function Sidebar() {
  const sidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleHiddenSidebar = () => {
    dispatch(hiddenSidebar());
  };

  return (
    <SidebarContainer>
      <SidebarWrapper showsidebar={sidebar.display ? 1 : 0}>
        <SidebarToolbar>
          <IconButton onClick={handleHiddenSidebar}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </SidebarToolbar>

        <Divider />
        <List>
          {dataList.map((data, index) => (
            <ListItem button key={data.name}>
              <ListItemIcon>{data.icon}</ListItemIcon>
              <ListItemText primary={data.name} />
            </ListItem>
          ))}
        </List>
      </SidebarWrapper>
    </SidebarContainer>
  );
}
