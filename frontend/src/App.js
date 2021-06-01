import logo from "./logo.svg";
import "./App.css";
//
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import studentTeacherPage from "./pages/student/teacher/teachers";
import studentCoursesPage from "./pages/student/course/courses";
import teacherCoursesPage from "./pages/teacher/course/Courses";
import adminPage from "./pages/admin/index";
import signin from "./pages/login/Signin";
import signup from "./pages/login/Signup";

import { useDispatch, useSelector } from "react-redux";
import ClassPage from "./pages/admin/class/ClassPage";
import TeacherPage from "./pages/admin/teacher/TeacherPage";
import StudentPage from "./pages/admin/student/StudentPage";
import MajorPage from "./pages/admin/major/MajorPage";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import { MainContainer } from "./components/commom/CommonElements";
import Notification from "./components/Notification/Notification";
import AlertDialog from "./components/Alerts/Alerts";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

function App() {
  const classes = useStyles();
  const user = useSelector((state) => state.user.user);
  const isTeacher = user ? user.is_teacher : false;
  const isStudent = user ? user.is_student : false;
  const isAdmin = user ? user.is_admin : false;

  const UserPages = () => (
    <>
      <Router>
        {/* <AlertDialog /> */}
        <Navbar />
        <Sidebar />
        <MainContainer>
          <Breadcrumbs />

          <Switch>
            {(isTeacher || isStudent) && (
              <>
                <Route path="/teacher" component={studentTeacherPage} />
                <Route
                  path="/course"
                  component={
                    isTeacher ? teacherCoursesPage : studentCoursesPage
                  }
                />
              </>
            )}
            {isAdmin && (
              <>
                <Route exact path="/" component={adminPage} />
                <Route path="/major" component={MajorPage} />
                <Route path="/class" component={ClassPage} />
                <Route path="/teacher" component={TeacherPage} />
                <Route path="/student" component={StudentPage} />
              </>
            )}
          </Switch>
        </MainContainer>
      </Router>
    </>
  );

  return (
    // <div className={classes.root}>
    <>
      <Router>
        <Notification />
        <Switch>
          <Route exact path="/sign-in" component={signin} />
          <Route exact path="/sign-up" component={signup} />
          <Route component={UserPages} />
        </Switch>
      </Router>
    </>
    // </div>
  );
}

export default App;
