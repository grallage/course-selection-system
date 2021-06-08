import React from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";

const initialFormValues = {
  // form fields
  name: "",
  description: "",
  is_active: true,
  id: -1,
  // form status
  formSubmitted: false,
  success: false,
  formType: "create", // create or edit
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url =
    values.formType === "create"
      ? process.env.REACT_APP_MAJOR_API
      : `${process.env.REACT_APP_MAJOR_API}${values.id}/`;
  let form = new FormData();
  form.append("name", values.name);
  form.append("description", values.description);
  form.append("is_active", values.is_active);

  return await axios({
    method: values.formType === "create" ? "post" : "put",
    url: url,
    data: form,
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
      errorCallback(error.response);
      return false;
    });
};

export const useFormControls = () => {
  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();

  const validate = (fieldValues = formValues) => {
    let tempErrors = { ...errors };
    if ("name" in fieldValues) {
      tempErrors.name = fieldValues.name ? "" : "请填写该字段。";
    }
    setErrors({
      ...tempErrors,
    });
  };

  const handleInputValue = (e) => {
    const { name, value, checked } = e.target;
    const nameValue = name === "is_active" ? checked : value;
    setFormValues({
      ...formValues,
      [name]: nameValue,
    });
    validate({ [name]: nameValue });
  };

  const handleSuccess = () => {
    if (formValues.formType === "create") {
      setFormValues({
        ...initialFormValues,
        formSubmitted: true,
        success: true,
        name: "",
        description: "",
        is_active: true,
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
  const handleError = (response) => {
    setFormValues({
      ...initialFormValues,
      formSubmitted: true,
      success: false,
    });
    let msg = "操作失败";
    if (response && response.data && response.data.detail) {
      msg = response.data.detail;
    }
    enqueueSnackbar(msg, {
      variant: "error",
    });
  };

  const formIsValid = (fieldValues = formValues) => {
    const isValid =
      fieldValues.name && Object.values(errors).every((x) => x === "");
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
