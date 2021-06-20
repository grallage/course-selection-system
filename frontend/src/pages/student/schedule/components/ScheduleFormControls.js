import React from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router";

const initialFormValues = {
  // form fields
  id: -1,
  course: {},
  week: "",
  time_span: "",
  address: "",
  // form status
  formSubmitted: false,
  success: false,
  formType: "create", // create or edit
  courses_change: false,
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url =
    values.formType === "create"
      ? process.env.REACT_APP_TEACHER_COURSE_SCHEDULE_API
      : `${process.env.REACT_APP_TEACHER_COURSE_SCHEDULE_API}${values.id}/`;
  let form = new FormData();

  form.append("course_id", values.course.value);
  form.append("week", values.week);
  form.append("time_span", values.time_span);
  form.append("address", values.address);

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
  const history = useHistory();
  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const validate = (fieldValues = formValues) => {
    let tempErrors = { ...errors };
    // console.log(fieldValues);

    if ("course" in fieldValues) {
      tempErrors.course =
        fieldValues.course && fieldValues.course.value ? "" : "请填写该字段";
    }
    if ("time_span" in fieldValues) {
      tempErrors.time_span = fieldValues.time_span ? "" : "没有选择授课时间段";
    }
    if ("week" in fieldValues) {
      tempErrors.week = fieldValues.week ? "" : "没有选择授课时间";
    }

    console.log(formValues);
    console.log(errors);

    setErrors({
      ...tempErrors,
    });
  };

  const handleInputValue = (e) => {
    const { name, value, checked } = e.target;
    const nameValue = value;
    setFormValues({
      ...formValues,
      [name]: nameValue,
    });

    validate({ [name]: nameValue });
  };

  const handleCourseValue = (selected) => {
    console.log(selected);

    setFormValues({
      ...formValues,
      course: selected,
      courses_change: true,
    });

    validate({ classes: selected });
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
      history.push("/schedule");
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

    if (response && response.data && response.data.user) {
      const msgList = Object.values(response.data.user);
      msgList.map((msg) => {
        enqueueSnackbar(msg, {
          variant: "error",
        });
      });
    } else if (response && response.data && response.data.detail) {
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
      fieldValues.week &&
      fieldValues.time_span &&
      fieldValues.course &&
      fieldValues.course.value &&
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
    handleCourseValue,
    handleFormSubmit,
    formIsValid,
  };
};
