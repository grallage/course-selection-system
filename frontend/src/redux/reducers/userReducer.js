const initialState = {
  token: localStorage.getItem("token", ""),
  user: JSON.parse(localStorage.getItem("user", "{}")),
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "add_token":
      return {
        ...state,
        token: action.payload,
      };
    case "add_user":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
