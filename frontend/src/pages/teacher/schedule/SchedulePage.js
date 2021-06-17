import React from "react";
import { Switch, Route } from "react-router-dom";
import ScheduleTable from "./components/ScheduleTable";
import ScheduleAdd from "./components/ScheduleAdd";

const SchedulePage = () => {
  return (
    <>
      <Switch>
        <Route
          path="/schedule/add"
          component={() => <ScheduleAdd type="create" />}
        />
        {/* <Route path="/schedule/add" component={ScheduleTable} /> */}
        <Route path="/schedule" component={ScheduleTable} />
      </Switch>
    </>
  );
};

export default SchedulePage;
