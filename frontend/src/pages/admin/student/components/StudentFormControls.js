import React from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";

const initialFormValues = {
  // form fields
  id: -1,
  full_name: "",
  password: "",
  email: "",
  sex: "SECRET",
  address: "",
  phone: "",
  is_active: true,
  code: "",
  classId: -1,
  classes: [],
  // form status
  formSubmitted: false,
  success: false,
  formType: "create", // create or edit
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url =
    values.formType === "create"
      ? process.env.REACT_APP_STUDENT_API
      : `${process.env.REACT_APP_STUDENT_API}${values.id}/`;
  let form = new FormData();

  form.append("user.full_name", values.full_name);
  if (values.formType === "create") {
    form.append("user.password", values.password);
  }
  form.append("user.id", values.id);
  form.append("user.email", values.email);
  form.append("user.sex", values.sex);
  form.append("user.address", values.address);
  form.append("user.phone", values.phone);
  form.append("user.is_active", values.is_active);
  // form.append("class_info", values.classId);
  form.append("classId", values.classId);

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

    //
    if ("full_name" in fieldValues) {
      tempErrors.full_name = fieldValues.full_name ? "" : "请填写该字段";
    }
    if ("email" in fieldValues) {
      tempErrors.email = fieldValues.email ? "" : "请填写该字段";
    }
    if ("sex" in fieldValues) {
      tempErrors.sex = fieldValues.sex ? "" : "请填写该字段";
    }
    if ("address" in fieldValues) {
      tempErrors.address = fieldValues.address ? "" : "请填写该字段";
    }
    if ("phone" in fieldValues) {
      tempErrors.phone = fieldValues.phone ? "" : "请填写该字段";
    }

    if ("password" in fieldValues && formValues.formType === "create") {
      tempErrors.password = fieldValues.password ? "" : "请填写该字段";
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
        classes: formValues.classes,
        formSubmitted: true,
        success: true,
      });
      enqueueSnackbar("创建成功", {
        variant: "success",
      });
    } else {
      setFormValues({
        ...formValues,
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
      ...formValues,
      formSubmitted: true,
      success: false,
    });

    if (response.data && response.data.user) {
      const msgList = Object.values(response.data.user);
      // msgList.map((msg) => {
      msgList.forEach((msg) => {
        enqueueSnackbar(msg, {
          variant: "error",
        });
      });
    } else if (response.data && response.data.detail) {
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
      fieldValues.full_name &&
      (fieldValues.password || formValues.formType !== "create") &&
      fieldValues.email &&
      fieldValues.sex &&
      fieldValues.phone &&
      Object.values(errors).every((x) => x === "");
    console.log(
      fieldValues.full_name &&
        (fieldValues.password || formValues.formType !== "create") &&
        fieldValues.email &&
        fieldValues.sex &&
        fieldValues.address &&
        fieldValues.phone
    );

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
