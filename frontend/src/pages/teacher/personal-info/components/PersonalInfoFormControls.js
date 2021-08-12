import React from "react";
import axios from "service/axiosConfig";

import { useSnackbar } from "notistack";

const initialFormValues = {
  // form fields
  id: -1,
  domain: "",
  office: "",
  address: "",
  phone: "",
  // form status
  formSubmitted: false,
  success: false,
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url = `${process.env.REACT_APP_TEACHER_TEACHER_API}${values.id}/`;

  let form = new FormData();
  form.append("user.id", values.id);
  form.append("domain", values.domain);
  form.append("office", values.office);
  form.append("user.address", values.address);
  form.append("user.phone", values.phone);

  axios
    .put(url, form)
    .then((response) => {
      return response.data;
    })
    .then((json) => {
      successCallback();
    })
    .catch((error) => {
      errorCallback(error.response);
    });
};

export const useFormControls = () => {
  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();

  const validate = (fieldValues = formValues) => {
    let tempErrors = { ...errors };

    //
    if ("domain" in fieldValues) {
      tempErrors.domain = fieldValues.domain ? "" : "请填写该字段";
    }
    if ("office" in fieldValues) {
      tempErrors.office = fieldValues.office ? "" : "请填写该字段";
    }
    if ("address" in fieldValues) {
      tempErrors.address = fieldValues.address ? "" : "请填写该字段";
    }
    if ("phone" in fieldValues) {
      tempErrors.phone = fieldValues.phone ? "" : "请填写该字段";
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
      formSubmitted: true,
      success: true,
    });
    enqueueSnackbar("更改成功", {
      variant: "success",
    });
  };
  const handleError = (response) => {
    setFormValues({
      ...formValues,
      formSubmitted: true,
      success: false,
    });

    if (response.data) {
      const msgList = Object.values(response.data);
      // msgList.map((msg) => {
      msgList.forEach((msg) => {
        enqueueSnackbar(msg, {
          variant: "error",
        });
      });
    } else if (response.data.detail) {
      let msg = "操作失败";
      if (response && response.data && response.data.detail) {
        msg = response.data.detail;
      }
      enqueueSnackbar(msg, {
        variant: "error",
      });
    } else {
      enqueueSnackbar("操作失败", {
        variant: "error",
      });
    }
  };

  const formIsValid = (fieldValues = formValues) => {
    const isValid =
      fieldValues.domain &&
      fieldValues.office &&
      fieldValues.address &&
      fieldValues.phone &&
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
