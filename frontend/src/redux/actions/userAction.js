export const AddToken = (token) => ({
  type: "add_token",
  payload: token,
});
export const AddUser = (user) => ({
  type: "add_user",
  payload: user,
});
export const UpdateUser = (user) => ({
  type: "update_user",
  payload: user,
});
export const RemoveUser = () => ({
  type: "remove_user",
  payload: {},
});
