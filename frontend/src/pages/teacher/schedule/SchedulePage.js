import React from "react";
import { Switch, Route } from "react-router-dom";
import { Main } from "components-teacher/common/CommonElements";
import ScheduleTable from "./components/ScheduleTable";
import ScheduleAdd from "./components/ScheduleAdd";

const SchedulePage = () => {
  return (
    <Main>
      <Switch>
        <Route
          path="/schedule/add"
          component={() => <ScheduleAdd type="create" />}
        />
        {/* <Route path="/schedule/add" component={ScheduleTable} /> */}
        <Route path="/schedule" component={ScheduleTable} />
      </Switch>
    </Main>
  );
};

export default SchedulePage;
