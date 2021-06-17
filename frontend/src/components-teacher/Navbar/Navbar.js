import React from "react";
import axios from "service/axiosConfig";

// redux
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import {
  Show as showSidebar,
  Hidden as hiddenSidebar,
} from "../../redux/actions/sidebarAction";

// components
import { Nav } from "react-bootstrap";
import { NavbarContainer, NavbarMenu } from "./NavbarElements";
import { GrMenu } from "react-icons/gr";

import { RemoveUser } from "../../redux/actions/userAction";

const Navbar = () => {
  const history = useHistory();
  const sidebar = useSelector((state) => state.sidebar);
  const teacherName = useSelector((state) => state.user.user.full_name);
  const dispatch = useDispatch();

  // sidebar
  const handleSidebar = () => {
    dispatch(sidebar.display ? hiddenSidebar() : showSidebar());
  };

  const goToPersonalInfoPage = () => {
    history.push("/personal-info");
  };

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

  return (
    <>
      <NavbarContainer expand="lg" showsidebar={sidebar.display ? 1 : 0}>
        <NavbarMenu onClick={handleSidebar}>
          <GrMenu />
        </NavbarMenu>
        <NavbarContainer.Toggle aria-controls="basic-navbar-nav" />
        <NavbarContainer.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>学生选课系统-教师管理后台</Nav.Link>
          </Nav>
          <Nav inline>
            <NavbarContainer.Text
              className="nav-link"
              onClick={goToPersonalInfoPage}
            >
              {teacherName}
            </NavbarContainer.Text>

            <NavbarContainer.Text className="nav-link" onClick={handleLogout}>
              退出
            </NavbarContainer.Text>
          </Nav>
        </NavbarContainer.Collapse>
      </NavbarContainer>
    </>
  );
};

export default Navbar;
