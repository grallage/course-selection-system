import React from "react";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { EmptyToolbar } from "../../../components/Toolbar/ToolbarElements";
import { Main, PageContainer } from "../../../components/commom/CommonElements";
import CourseList from "./components/CourseList";
import CourseAdd from "./components/CourseAdd";

export default function courses() {
  return (
    <Main>
      <EmptyToolbar />
      <PageContainer maxWidth="xl">
        {/* <MainContainer maxWidth="lg"> */}
        <Grid container spacing={3}>
          {/* <Router> */}
          <Switch>
            <Route path="/course/create" component={CourseAdd} />
            <Route component={CourseList} />
          </Switch>
          {/* </Router> */}
        </Grid>
      </PageContainer>
    </Main>
  );
}

//
