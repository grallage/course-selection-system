import React from "react";

import {
  PageContainer,
  GridContainer,
} from "../../../components/commom/CommonElements";

import { Switch, Route } from "react-router-dom";
import MajorForm from "./components/MajorForm";
import MajorList from "./components/MajorList";

function MajorPage() {
  return (
    <main>
      <PageContainer maxWidth="lg">
        <GridContainer>
          <Switch>
            <Route
              path="/major/create"
              render={() => <MajorForm type="create" />}
            />
            <Route
              path="/major/edit/:id"
              render={() => <MajorForm type="edit" />}
            />
            <Route path="/major" component={MajorList} />
          </Switch>
        </GridContainer>
      </PageContainer>
    </main>
  );
}

export default MajorPage;
