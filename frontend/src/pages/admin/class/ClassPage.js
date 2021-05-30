import React from "react";
import { EmptyToolbar } from "../../../components/Toolbar/ToolbarElements";
import ClassForm from "./components/ClassForm";
import { Main, PageContainer } from "../../../components/commom/CommonElements";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function ClassPage() {
  return (
    <main>
      <EmptyToolbar />

      <PageContainer maxWidth="xl">
        {/* <MainContainer maxWidth="lg"> */}
        <Grid container spacing={3}>
          <Router>
            <Switch>
              <Route exact path="/class/create" component={ClassForm} />
              {/* <Route component={<>班级管理页</>} /> */}
            </Switch>
          </Router>
        </Grid>
      </PageContainer>
    </main>
  );
}

export default ClassPage;
