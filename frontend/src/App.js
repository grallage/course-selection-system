import "./App.css";
import history from "./service/history";
//
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { useSelector } from "react-redux";

import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import { MainContainer } from "./components/commom/CommonElements";
// import Notification from "./components/Notification/Notification";
// import AlertDialog from "./components/Alerts/Alerts";

import studentTeacherPage from "./pages/student/teacher/teachers";
import studentCoursesPage from "./pages/student/course/courses";

// page
import signin from "./pages/login/Signin";
import signup from "./pages/login/Signup";

// admin page
import ClassPage from "./pages/admin/class/ClassPage";
import TeacherPage from "./pages/admin/teacher/TeacherPage";
import StudentPage from "./pages/admin/student/StudentPage";
import MajorPage from "./pages/admin/major/MajorPage";
import PasswordPage from "./pages/admin/password/PasswordPage";

// teacher page
import { Main as TeacherMainContainer } from "components-teacher/common/CommonElements";
import teacherCoursesPage from "./pages/teacher/course/CoursePage";
import teacherSchedulePage from "./pages/teacher/schedule/SchedulePage";
import teacherPasswordPage from "./pages/teacher/password/PasswordPage";
import PersonalInfoPage from "./pages/teacher/personal-info/PersonalInfoPage";
import StudentScoresPage from "./pages/teacher/student-scores/StudentScoresPage";
import teacherPage from "./pages/teacher/index";
import TeacherNavbar from "./components-teacher/Navbar/Navbar";
import TeacherSidebar from "./components-teacher/Sidebar/Sidebar";
import TeacherBreadcrumbs from "./components-teacher/Breadcrumbs/Breadcrumbs";

import adminPage from "./pages/admin/index";

// css
import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

function App() {
  const classes = useStyles();
  const isTeacher = useSelector((state) =>
    state.user.user ? state.user.user.is_teacher : false
  );
  const isStudent = useSelector((state) =>
    state.user.user ? state.user.user.is_student : false
  );
  const isAdmin = useSelector((state) =>
    state.user.user ? state.user.user.is_admin : false
  );

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
          <TeacherMainContainer>
            <TeacherBreadcrumbs />
            <Route exact path="/" component={teacherPage} />
            <Route path="/course" component={teacherCoursesPage} />
            <Route path="/schedule" component={teacherSchedulePage} />
            <Route path="/password" component={teacherPasswordPage} />
            <Route path="/student-scores" component={StudentScoresPage} />
            <Route path="/personal-info" component={PersonalInfoPage} />
          </TeacherMainContainer>
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
