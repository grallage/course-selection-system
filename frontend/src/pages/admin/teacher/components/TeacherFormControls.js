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
  domain: "",
  office: "",
  code: "",
  // form status
  formSubmitted: false,
  success: false,
  formType: "create", // create or edit
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url =
    values.formType === "create"
      ? process.env.REACT_APP_TEACHER_API
      : `${process.env.REACT_APP_TEACHER_API}${values.id}/`;
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

  form.append("domain", values.domain);
  form.append("office", values.office);

  return await axios({
    method: values.formType === "create" ? "post" : "put",
    url: url,
    data: form,
  })
    .then((response) => {
      // console.log(response);
      return response.data;
    })
    .then((json) => {
      // console.log(json);
      successCallback();
      return true;
    })
    .catch((error) => {
      errorCallback(error.response);
      return false;
    });
};

export const useFormControls = ({ closeDialog, getTeacherList }) => {
  const [formValues, setFormValues] = React.useState(initialFormValues);
  //   const [closeDialogFunction, setCloseDialogFunction] = React.useState();
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();

  const validate = (fieldValues = formValues) => {
    let tempErrors = { ...errors };

    //
    if ("full_name" in fieldValues) {
      tempErrors.full_name = fieldValues.full_name ? "" : "??????????????????";
    }
    if ("email" in fieldValues) {
      tempErrors.email = fieldValues.email ? "" : "??????????????????";
    }
    if ("sex" in fieldValues) {
      tempErrors.sex = fieldValues.sex ? "" : "??????????????????";
    }
    if ("address" in fieldValues) {
      tempErrors.address = fieldValues.address ? "" : "??????????????????";
    }
    if ("phone" in fieldValues) {
      tempErrors.phone = fieldValues.phone ? "" : "??????????????????";
    }
    // if ("is_active" in fieldValues) {
    //   tempErrors.is_active = fieldValues.is_active ? "" : "??????????????????";
    // }
    if ("domain" in fieldValues) {
      tempErrors.domain = fieldValues.domain ? "" : "??????????????????";
    }
    if ("office" in fieldValues) {
      tempErrors.office = fieldValues.office ? "" : "??????????????????";
    }
    if ("password" in fieldValues && formValues.formType === "create") {
      tempErrors.password = fieldValues.password ? "" : "??????????????????";
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
      });
      enqueueSnackbar("????????????", {
        variant: "success",
      });
    } else {
      setFormValues({
        formSubmitted: true,
        success: true,
      });
      enqueueSnackbar("????????????", {
        variant: "success",
      });
    }
    closeDialog();
    getTeacherList();
  };
  const handleError = (response) => {
    console.log("handleError:");
    console.log(response);

    if (formValues.formType === "create") {
      setFormValues({
        ...formValues,
        formSubmitted: true,
        success: false,
      });
    } else {
      setFormValues({
        ...initialFormValues,
        formSubmitted: true,
        success: false,
      });
    }

    if (response.data && response.data.user) {
      const msgList = Object.values(response.data.user);
      msgList.map((msg) => {
        enqueueSnackbar(msg, {
          variant: "error",
        });
      });
    } else if (response.data && response.data.detail) {
      let msg = "????????????";
      if (response && response.data && response.data.detail) {
        msg = response.data.detail;
      }
      enqueueSnackbar(msg, {
        variant: "error",
      });
    } else {
      enqueueSnackbar("????????????", {
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
      fieldValues.address &&
      fieldValues.phone &&
      //   fieldValues.is_active &&
      fieldValues.domain &&
      fieldValues.office &&
      //   fieldValues.description &&
      //   fieldValues.is_active &&
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
