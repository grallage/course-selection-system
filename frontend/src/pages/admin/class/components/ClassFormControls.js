import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useSnackbar } from "notistack";

const initialFormValues = {
  // form fields
  classCount: "",
  year: new Date(),
  majorId: -1,
  majors: [],
  id: -1,
  // form status
  formSubmitted: false,
  success: false,
  formType: "create", // create or edit
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url =
    values.formType === "create"
      ? process.env.REACT_APP_CLASS_API
      : `${process.env.REACT_APP_CLASS_API}${values.id}/`;
  let form = new FormData();
  form.append("majorId", values.majorId);
  form.append("classCount", values.classCount);
  form.append("year", values.year.toISOString());

  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.withCredentials = true;

  var csrfCookie = Cookies.get("csrftoken");
  // console.log(csrfCookie);
  return await axios({
    method: values.formType === "create" ? "post" : "put",
    url: url,
    data: form,
    header: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .then((json) => {
      console.log(json);
      successCallback();
      return true;
    })
    .catch((error) => {
      errorCallback(error);
      return false;
    });
};

export const useFormControls = () => {
  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const validate = (fieldValues = formValues) => {
    let tempErrors = { ...errors };
    if ("majorId" in fieldValues) {
      tempErrors.majorId = fieldValues.majorId ? "" : "请选择专业。";
    }
    if ("year" in fieldValues) {
      tempErrors.year = fieldValues.year ? "" : "请填写该字段。";
    }
    if ("classCount" in fieldValues) {
      tempErrors.classCount = fieldValues.classCount ? "" : "请填写该字段。";
    }
    setErrors({
      ...tempErrors,
    });
  };

  const handleInputValue = (e) => {
    let { name, value, checked } = e.target;

    if (name === "classCount" && value) {
      value = Math.min(Math.max(value, 1), 10);
    }

    setFormValues({
      ...formValues,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const handleDateValue = (date) => {
    setFormValues({
      ...formValues,
      year: date,
    });
    validate({ year: date });
  };

  const handleSuccess = () => {
    if (formValues.formType === "create") {
      setFormValues({
        ...initialFormValues,
        formSubmitted: true,
        success: true,
      });
      enqueueSnackbar("创建成功", {
        variant: "success",
      });
    } else {
      setFormValues({
        formSubmitted: true,
        success: true,
      });
      enqueueSnackbar("编辑成功", {
        variant: "success",
      });
    }
  };
  const handleError = (error) => {
    console.log("handleError:");
    console.log(error.response);
    setFormValues({
      ...initialFormValues,
      formSubmitted: true,
      success: false,
    });
    let msg = "操作失败";
    if (error.response) {
      msg = error.response.data.msg;
    }

    enqueueSnackbar(msg, {
      variant: "error",
    });
  };

  const formIsValid = (fieldValues = formValues) => {
    const isValid =
      fieldValues.majorId &&
      fieldValues.year &&
      fieldValues.classCount &&
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
    handleDateValue,
    handleFormSubmit,
    formIsValid,
  };
};
