const initialState = {
  open: false,
};
const NotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "notify":
      return {
        ...state,
        msg: action.payload.msg,
        duration: action.payload.duration,
        type: action.payload.type,
        open: true,
      };
    case "close":
      return {
        ...state,
        msg: "",
        type: null,
        open: false,
      };

    default:
      return state;
  }
};

export default NotificationReducer;
