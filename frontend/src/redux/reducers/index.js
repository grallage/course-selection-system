import { combineReducers } from "redux";
import sidebarReducer from "./sidebarReducer";
import userReducer from "./userReducer";

const reducers = combineReducers({
  sidebar: sidebarReducer,
  user: userReducer,
});

export default reducers;
