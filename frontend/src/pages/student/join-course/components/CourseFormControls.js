import React from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";

const initialFormValues = {
  // form fields
  id: -1,
  title: "",
  is_compulsory: true,
  credit: 0,
  student_limit: 0,
  deadline: "",
  endtime: "",
  outline: "",
  evaluation_standard: "",
  book: "",

  classes: [],
  all_classes: [],
  // form status
  formSubmitted: false,
  success: false,
  formType: "create", // create or edit
  classes_change: false,
  deadline_change: false,
};

const PostForm = async (values, successCallback, errorCallback) => {
  let url =
    values.formType === "create"
      ? process.env.REACT_APP_TEACHER_COURSE_API
      : `${process.env.REACT_APP_TEACHER_COURSE_API}${values.id}/`;
  let form = new FormData();

  form.append("title", values.title);
  form.append("is_compulsory", values.is_compulsory);
  form.append("credit", values.credit);
  if (values.is_compulsory && values.formType === "create") {
    form.append("classeIds", values.classes);
  } else if (!values.is_compulsory) {
    form.append("student_limit", values.student_limit);
    // form.append("deadline", values.deadline);
    form.append("deadline", values.deadline.toISOString());
  }

  form.append("outline", values.outline);
  form.append("evaluation_standard", values.evaluation_standard);
  form.append("book", values.book);

  return await axios({
    method: values.formType === "create" ? "post" : "put",
    url: url,
    data: form,
  })
    .then((response) => {
      return response.data;
    })
    .then((json) => {
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const validate = (fieldValues = formValues) => {
    let tempErrors = { ...errors };
    // console.log(fieldValues);

    //
    if ("title" in fieldValues) {
      tempErrors.title = fieldValues.title ? "" : "请填写该字段";
    }
    if ("credit" in fieldValues) {
      tempErrors.credit = fieldValues.credit ? "" : "请填写该字段";
    }
    if ("student_limit" in fieldValues) {
      tempErrors.student_limit = fieldValues.student_limit
        ? ""
        : "请填写该字段";
    }
    if ("deadline" in fieldValues) {
      tempErrors.deadline = fieldValues.deadline ? "" : "请填写该字段";
    }
    if ("endtime" in fieldValues) {
      tempErrors.endtime = fieldValues.endtime ? "" : "请填写该字段";
    }
    if ("outline" in fieldValues) {
      tempErrors.outline = fieldValues.outline ? "" : "请填写该字段";
    }
    if ("evaluation_standard" in fieldValues) {
      tempErrors.evaluation_standard = fieldValues.evaluation_standard
        ? ""
        : "请填写该字段";
    }
    if ("book" in fieldValues) {
      tempErrors.book = fieldValues.book ? "" : "请填写该字段";
    }
    if (formValues.formType === "create" && formValues.is_compulsory) {
      tempErrors.student_limit = "";
      tempErrors.deadline = "";
      if ("classes" in fieldValues) {
        tempErrors.classes =
          fieldValues.classes.length === 0 ? "请选择班级" : "";
      } else {
        tempErrors.classes =
          formValues.classes.length === 0 ? "请选择班级" : "";
      }
    } else if (!formValues.is_compulsory) {
      tempErrors.classes = "";
    }

    setErrors({
      ...tempErrors,
    });
  };

  const handleInputValue = (e) => {
    const { name, value, checked } = e.target;
    const nameValue =
      name === "is_compulsory" ? (value === "true" ? true : false) : value;
    // const nameValue = value;
    // console.log(name, nameValue);
    setFormValues({
      ...formValues,
      [name]: nameValue,
    });

    validate({ [name]: nameValue });
  };

  const handleClassesValue = (selected) => {
    console.log(selected);
    setFormValues({
      ...formValues,
      classes: selected,
      classes_change: true,
    });

    validate({ classes: selected });
  };
  const handleDeadlineValue = (selected) => {
    console.log(selected);
    setFormValues({
      ...formValues,
      deadline: selected,
      deadline_change: true,
    });

    validate({ deadline: selected });
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
      fieldValues.title &&
      fieldValues.credit &&
      (formValues.is_compulsory
        ? fieldValues.classes
        : fieldValues.student_limit && fieldValues.deadline) &&
      fieldValues.outline &&
      fieldValues.evaluation_standard &&
      fieldValues.book &&
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
    handleClassesValue,
    handleDeadlineValue,
    handleFormSubmit,
    formIsValid,
  };
};
