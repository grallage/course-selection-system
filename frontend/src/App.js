import "./App.css";
import history from "./service/history";
//
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import ClassPage from "./pages/admin/class/ClassPage";
import TeacherPage from "./pages/admin/teacher/TeacherPage";
import StudentPage from "./pages/admin/student/StudentPage";
import MajorPage from "./pages/admin/major/MajorPage";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import { MainContainer } from "./components/commom/CommonElements";
import Notification from "./components/Notification/Notification";
import AlertDialog from "./components/Alerts/Alerts";
import PasswordPage from "./pages/admin/password/PasswordPage";

// page
import studentTeacherPage from "./pages/student/teacher/teachers";
import studentCoursesPage from "./pages/student/course/courses";
import teacherCoursesPage from "./pages/teacher/course/CoursePage";
import teacherSchedulePage from "./pages/teacher/schedule/SchedulePage";
import adminPage from "./pages/admin/index";
import signin from "./pages/login/Signin";
import signup from "./pages/login/Signup";
import teacherPage from "./pages/teacher/index";
import TeacherNavbar from "./components-teacher/Navbar/Navbar";
import TeacherSidebar from "./components-teacher/Sidebar/Sidebar";

// css
import "bootstrap/dist/css/bootstrap.min.css";

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
      {isAdmin && (
        <>
          <Navbar />
          <Sidebar />
          <MainContainer>
            <Breadcrumbs />
            <Switch>
              <Route exact path="/" component={adminPage} />
              <Route path="/major" component={MajorPage} />
              <Route path="/class" component={ClassPage} />
              <Route path="/teacher" component={TeacherPage} />
              <Route path="/student" component={StudentPage} />
              <Route exact path="/password" component={PasswordPage} />
            </Switch>
          </MainContainer>
        </>
      )}
      {isTeacher && (
        <>
          <TeacherNavbar />
          <TeacherSidebar />
          <Route exact path="/" component={teacherPage} />
          <Route path="/course" component={teacherCoursesPage} />
          <Route path="/schedule" component={teacherSchedulePage} />
        </>
      )}
    </>
  );

  return (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/sign-in" component={signin} />
          <Route exact path="/sign-up" component={signup} />
          <Route component={UserPages} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
