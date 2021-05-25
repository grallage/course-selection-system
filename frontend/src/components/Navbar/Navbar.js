import React, { useState } from "react";

import Toolbar from "@material-ui/core/Toolbar";
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
} from "./NavbarElements";

const Navbar = () => {
  const sidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

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

  const profileMenu = (
    <Menu
      anchorEl={profileBtn}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem>个人信息</MenuItem>
      <MenuItem>退出</MenuItem>
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

  return (
    <>
      <NavbarContainer position="fixed" showsidebar={sidebar.display ? 1 : 0}>
        <Toolbar>
          {!sidebar.display && (
            <ToolbarLeft onClick={handleSidebar}>
              <MenuIcon />
            </ToolbarLeft>
          )}

          <ToolbarTitle>学生选课系统</ToolbarTitle>
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
        </Toolbar>
      </NavbarContainer>
      {profileMenu}
      {mobileMoreMenu}
    </>
  );
};

export default Navbar;
