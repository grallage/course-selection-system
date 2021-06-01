import { combineReducers } from "redux";
import NotificationReducer from "./notificationReducer";
import sidebarReducer from "./sidebarReducer";
import userReducer from "./userReducer";

const reducers = combineReducers({
  sidebar: sidebarReducer,
  user: userReducer,
  notification: NotificationReducer,
});

export default reducers;
