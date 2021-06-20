import React from "react";
import axios from "service/axiosConfig";

// redux
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

// components
import { Nav } from "react-bootstrap";
import { NavbarContainer, NavbarMenu } from "./NavbarElements";

import { RemoveUser } from "../../redux/actions/userAction";
import { NavDropdown } from "react-bootstrap";

const Navbar = () => {
  const history = useHistory();

  const studentName = useSelector((state) => state.user.user.full_name);
  const dispatch = useDispatch();

  const goToPersonalInfoPage = () => {
    history.push("/personal-info");
  };
  const goToPasswordPage = () => {
    history.push("/password");
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
      <NavbarContainer expand="lg" className="navbar-dark bg-primary">
        <NavbarContainer.Brand>学生选课系统-学生管理后台</NavbarContainer.Brand>

        <NavbarContainer.Toggle aria-controls="basic-navbar-nav" />
        <NavbarContainer.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/course">课程查询</Nav.Link>
            <Nav.Link href="/schedule">课程表</Nav.Link>
            <Nav.Link href="/course-join">选修报名</Nav.Link>
          </Nav>

          {/* <Nav inline> */}
          <Nav>
            <NavbarContainer.Text
              className="nav-link"
              onClick={goToPersonalInfoPage}
            >
              {studentName}
            </NavbarContainer.Text>
            <NavbarContainer.Text
              className="nav-link"
              onClick={goToPasswordPage}
            >
              更改密码
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
