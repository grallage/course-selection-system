import React from "react";

import { useTheme } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

// redux
import { useDispatch, useSelector } from "react-redux";
import { Hidden as hiddenSidebar } from "../../redux/actions/sidebarAction";
import { SidebarWrapper } from "./SidebarElements";

import { teacherLinks, studentLinks, admininks } from "./data";
import { EmptyToolbar } from "../Toolbar/ToolbarElements";
import { CommonLink } from "../commom/CommonElements";

export default function Sidebar() {
  const sidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const theme = useTheme();
  const is_teacher = useSelector((state) => state.user.user.is_teacher);
  const is_student = useSelector((state) => state.user.user.is_student);
  const is_admin = useSelector((state) => state.user.user.is_admin);
  const dataList = is_admin
    ? admininks
    : is_teacher
    ? teacherLinks
    : is_student
    ? studentLinks
    : [];

  const handleHiddenSidebar = () => {
    dispatch(hiddenSidebar());
  };

  return (
    <SidebarWrapper showsidebar={sidebar.display ? 1 : 0}>
      <EmptyToolbar>
        <IconButton onClick={handleHiddenSidebar}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </EmptyToolbar>

      <Divider />
      <List>
        {dataList.map((data, index) => (
          <CommonLink to={data.url} key={data.name}>
            <ListItem button>
              <ListItemIcon>
                {/* <IconButton>
                  </IconButton> */}
                <Icon>{data.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={data.name} />
            </ListItem>
          </CommonLink>
        ))}
      </List>
    </SidebarWrapper>
  );
}
