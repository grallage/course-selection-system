import axios from "axios";
// import { useSnackbar } from "notistack";
// const { enqueueSnackbar } = useSnackbar();
const instance = axios.create({
  // baseURL: 'https://api.example.com'
});

instance.defaults.xsrfCookieName = "csrftoken";
instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
instance.defaults.withCredentials = true;
instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("token", "");
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // const response = error.response;
    // if (response && response.data && response.data.detail) {
    //   enqueueSnackbar(response.data.detail, {
    //     variant: "error",
    //   });
    // }
    return Promise.reject(error);
  }
);

export default instance;
