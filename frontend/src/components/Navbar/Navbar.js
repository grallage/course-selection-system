import React, { useState } from "react";
import axios from "service/axiosConfig";

import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  Show as showSidebar,
  Hidden as hiddenSidebar,
} from "../../redux/actions/sidebarAction";

// styled-components
import {
  ToolbarLeft,
  ToolbarMiddle,
  ToolbarTitle,
  ToolbarRightPC,
  ToolbarRightMobile,
  NavbarContainer,
  ToolbarLink,
} from "./NavbarElements";
import { EmptyToolbar } from "../Toolbar/ToolbarElements";

import { useHistory } from "react-router";
import { RemoveUser } from "../../redux/actions/userAction";
import NavbarUserInfoAlert from "./NavbarUserAlert";
import { useDialog } from "../../providers/DialogProvider";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const sidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const history = useHistory();
  const { createDialog } = useDialog();

  const [profileBtn, setProfileBtn] = useState(null);
  const [mobileMoreBtn, setMobileMoreBtn] = useState(null);

  const isProfileMenuOpen = Boolean(profileBtn);
  const isMobileMenuOpen = Boolean(mobileMoreBtn);

  // sidebar
  const handleSidebar = () => {
    dispatch(sidebar.display ? hiddenSidebar() : showSidebar());
  };

  // open menu
  const handleProfileMenuOpen = (event) => {
    setProfileBtn(event.currentTarget);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreBtn(event.currentTarget);
  };

  // close menu
  const handleMobileMenuClose = () => setMobileMoreBtn(null);
  const handleProfileMenuClose = () => setProfileBtn(null);

  const handleLogout = async () => {
    dispatch(RemoveUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    let url = process.env.REACT_APP_LOGOUT_API;

    await axios
      .post(url, {})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error.response.status);
      });
    history.push("/sign-in");
  };

  const profileMenu = (
    <Menu
      anchorEl={profileBtn}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={() => openUserDialog()}>个人信息</MenuItem>
      <MenuItem onClick={handleLogout}>退出</MenuItem>
    </Menu>
  );

  const mobileMoreMenu = (
    <Menu
      anchorEl={mobileMoreBtn}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>Profile</MenuItem>
      <MenuItem>My account</MenuItem>
    </Menu>
  );

  const openUserDialog = () => {
    createDialog({
      children: <NavbarUserInfoAlert />,
    });
  };

  return (
    <>
      <NavbarContainer position="fixed" showsidebar={sidebar.display ? 1 : 0}>
        {/* <Toolbar> */}
        <EmptyToolbar>
          {!sidebar.display && (
            <ToolbarLeft onClick={handleSidebar}>
              <MenuIcon />
            </ToolbarLeft>
          )}
          <ToolbarTitle>
            <ToolbarLink to="/">
              学生选课系统 -
              {user.is_admin
                ? " 管理员后台"
                : user.is_teacher
                ? " 教师后台"
                : " 学生后台"}
            </ToolbarLink>
          </ToolbarTitle>
          <ToolbarMiddle />

          <ToolbarRightPC>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>
          </ToolbarRightPC>

          <ToolbarRightMobile>
            <IconButton color="inherit" onClick={handleMobileMenuOpen}>
              <MoreIcon />
            </IconButton>
          </ToolbarRightMobile>
          {/* </Toolbar> */}
        </EmptyToolbar>
      </NavbarContainer>
      {profileMenu}
      {mobileMoreMenu}
    </>
  );
};

export default Navbar;
