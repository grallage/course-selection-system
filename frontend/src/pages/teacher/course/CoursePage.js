import React from "react";
import { Switch, Route } from "react-router-dom";
import { Main } from "components-teacher/common/CommonElements";
import CourseForm from "../course/components/CourseForm";
import CourseList from "../course/components/CourseList";

const CoursePage = () => {
  return (
    <Main>
      <Switch>
        <Route
          path="/course/create"
          render={() => <CourseForm type="create" />}
        />
        <Route
          path="/course/edit/:id"
          render={() => <CourseForm type="edit" />}
        />

        <Route path="/course" component={CourseList} />
      </Switch>
    </Main>
  );
};

export default CoursePage;
