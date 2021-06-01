export const Notify = ({ msg, type = "success", duration = 6000 }) => ({
  type: "notify",
  payload: { msg, type, duration },
});

export const CloseNotify = () => ({
  type: "close",
  payload: {},
});
