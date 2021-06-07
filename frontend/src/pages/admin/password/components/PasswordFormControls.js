import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const initialFormValues = {
  // form fields
  id: -1,
  password: "",
  new_password1: "",
  new_password2: "",
  token: "",
  // form status
  formSubmitted: false,
  success: false,
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url = `${process.env.REACT_APP_STUDENT_PASSWORD_API}${values.id}/`;

  let form = new FormData();
  form.append("id", values.id);
  form.append("password", values.password);
  form.append("new_password1", values.new_password1);
  form.append("new_password2", values.new_password2);

  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.withCredentials = true;

  axios
    .put(url, form, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${values.token}`,
      },
    })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .then((json) => {
      console.log(json);
      successCallback();
    })
    .catch((error) => {
      errorCallback(error.response);
    });
};

export const useFormControls = () => {
  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const validate = (fieldValues = formValues) => {
    let tempErrors = { ...errors };

    //
    if ("password" in fieldValues) {
      tempErrors.password = fieldValues.password ? "" : "请填写该字段";
    }
    if ("new_password1" in fieldValues) {
      tempErrors.new_password1 = fieldValues.new_password1
        ? ""
        : "请填写该字段";
    }
    if ("new_password2" in fieldValues) {
      tempErrors.new_password2 = fieldValues.new_password2
        ? ""
        : "请填写该字段";
    }
    if (
      formValues.new_password2.length > 0 &&
      formValues.new_password1.length > 0
    ) {
      tempErrors.new_password2 =
        formValues.new_password2 === formValues.new_password1
          ? ""
          : "新密码不一致";
    }

    setErrors({
      ...tempErrors,
    });
  };

  const handleInputValue = (e) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const handleSuccess = () => {
    setFormValues({
      ...formValues,
      password: "",
      new_password1: "",
      new_password2: "",
      formSubmitted: true,
      success: true,
    });
    enqueueSnackbar("更改成功", {
      variant: "success",
    });
  };
  const handleError = (response) => {
    console.log("handleError:");
    console.log(response);

    setFormValues({
      ...formValues,
      formSubmitted: true,
      success: false,
    });

    if (response.data) {
      const msgList = Object.values(response.data);
      msgList.map((msg) => {
        enqueueSnackbar(msg, {
          variant: "error",
        });
      });
    } else {
      enqueueSnackbar("操作失败", {
        variant: "error",
      });
    }
  };

  const formIsValid = (fieldValues = formValues) => {
    const isValid =
      fieldValues.password &&
      fieldValues.new_password1 &&
      fieldValues.new_password2 &&
      Object.values(errors).every((x) => x === "");

    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formIsValid()) {
      return PostForm(formValues, handleSuccess, handleError);
    }
  };

  return {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleFormSubmit,
    formIsValid,
  };
};
