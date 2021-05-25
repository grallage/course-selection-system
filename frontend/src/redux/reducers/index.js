import { combineReducers } from "redux";
import sidebarReducer from "./sidebarReducer";

const reducers = combineReducers({
  sidebar: sidebarReducer,
});

export default reducers;
