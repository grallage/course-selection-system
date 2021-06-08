import React from "react";
import { PageContainer, GridContainer } from "components/commom/CommonElements";
import { Switch, Route } from "react-router-dom";
import TeacherList from "./components/TeacherList";

function TeacherPage() {
  return (
    <main>
      <PageContainer maxWidth="lg">
        <GridContainer>
          <Switch>
            <Route path="/teacher" component={TeacherList} />
          </Switch>
        </GridContainer>
      </PageContainer>
    </main>
  );
}

export default TeacherPage;
