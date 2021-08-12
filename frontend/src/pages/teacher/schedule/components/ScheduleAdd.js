import React, { useEffect, useState } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router";

import { Card } from "components-teacher/common/CommonElements";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";

import { useFormControls } from "./ScheduleFormControls";

function createCourseData(item) {
  let label = item.title;
  if (item.is_compulsory) {
    label = `必修 ${item.title} ${item.class_info.name}`;
  } else {
    label = `选修 ${item.title}`;
  }
  return { value: item.id, label: label };
}

const ScheduleAdd = ({ type }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(type === "edit");
  const [courses, setCourses] = React.useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const week = history.location.state.week;
  const timespan = history.location.state.timespan;

  const {
    formValues,
    setFormValues,
    // errors,
    // handleInputValue,
    handleCourseValue,
    handleFormSubmit,
    formIsValid,
    // handleDeadlineValue,
  } = useFormControls();

  useEffect(() => {
    const init = async () => {
      console.log(week, timespan);
      setFormValues({
        ...formValues,
        week: week[0],
        time_span: timespan[0],
      });

      const courseList = (await getCourseList()).map((item) => {
        return createCourseData(item);
      });
      console.log(courseList);
      setCourses(courseList);
    };
    init();
  }, []);

  const getCourseList = async (event) => {
    if (event) {
      event.preventDefault();
    }

    let url = process.env.REACT_APP_TEACHER_COURSE_API;

    return await axios
      .get(url, {
        params: {
          get_all: true,
          ordering: "-id",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.data && response.data.detail) {
          enqueueSnackbar(response.data.detail, {
            variant: "error",
          });
        }
        return [];
      });
  };

  return (
    <Card>
      <Card.Header>
        {type === "create" ? "添加课程表" : "编辑课程表"}
      </Card.Header>
      <Card.Body>
        {!isLoading && (
          <Form>
            <Form.Row>
              <Form.Group className="col-4">
                <Form.Label>授课时间</Form.Label>
                <Form.Control value={`${week[1]} ${timespan[1]}`} readOnly />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group className="col-4">
                <Form.Label>授课课程和班级</Form.Label>
                <Select
                  name="course"
                  className="form-select"
                  options={courses}
                  placeholder="选择授课班级"
                  // value={formValues.course}
                  onChange={handleCourseValue}
                  isSearchable={true}
                  isClearable={true}
                />

                <Form.Control.Feedback type="invalid">
                  {/* {errors["title"]} */}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Button
              variant="primary"
              onClick={handleFormSubmit}
              disabled={!formIsValid()}
            >
              提交
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default ScheduleAdd;
