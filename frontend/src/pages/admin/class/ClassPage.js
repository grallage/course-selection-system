import React from "react";
import ClassForm from "./components/ClassForm";
import { GridContainer, PageContainer } from "components/commom/CommonElements";

import { Switch, Route } from "react-router-dom";
import ClassList from "./components/ClassList";

function ClassPage() {
  return (
    <main>
      <PageContainer maxWidth="lg">
        <GridContainer>
          <Switch>
            <Route
              path="/class/create"
              render={() => <ClassForm type="create" />}
            />

            <Route path="/class" component={ClassList} />
          </Switch>
        </GridContainer>
      </PageContainer>
    </main>
  );
}

export default ClassPage;
