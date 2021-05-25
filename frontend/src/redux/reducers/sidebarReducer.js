const initialState = {
  //   sidebar: null,
  display: false,
};
const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "show":
      return {
        ...state,
        display: true,
      };
    case "hidden":
      return {
        ...state,
        display: false,
      };
    default:
      return state;
  }
};

export default sidebarReducer;
