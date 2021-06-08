import React from "react";
import { PageContainer, GridContainer } from "components/commom/CommonElements";
import { Switch, Route } from "react-router-dom";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";

function StudentPage() {
  return (
    <main>
      <PageContainer maxWidth="lg">
        <GridContainer>
          <Switch>
            <Route
              path="/student/create"
              render={() => <StudentForm type="create" />}
            />
            <Route
              path="/student/edit/:id"
              render={() => <StudentForm type="edit" />}
            />
            <Route path="/student" component={StudentList} />
          </Switch>
        </GridContainer>
      </PageContainer>
    </main>
  );
}

export default StudentPage;
