import React, { useEffect, useState } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

import { Card, DatePicker } from "components-teacher/common/CommonElements";
import { Button, Form, Col, Row } from "react-bootstrap";

// dual-listbox
// https://jakezatecky.github.io/react-dual-listbox/
// https://www.npmjs.com/package/react-dual-listbox
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";

import { useFormControls } from "./CourseFormControls";

function createData(item) {
  return { value: item.id, label: item.name };
}

const CourseForm = ({ type }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(type === "edit");
  const [classInfo, setClassInfo] = useState();
  const [originalDeadline, setOriginalDeadline] = useState();

  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleClassesValue,

    handleFormSubmit,
    formIsValid,
    handleDeadlineValue,
  } = useFormControls();

  useEffect(() => {
    const init = async () => {
      const classes = await getClasses();
      const all_classes = classes.map((item) => {
        return createData(item);
      });

      // console.log(all_classes);

      if (type === "edit") {
        let {
          title,
          is_compulsory,
          credit,
          student_limit,
          deadline,
          // endtime,
          outline,
          evaluation_standard,
          book,
          class_info,
        } = await getCourse();
        setClassInfo(class_info);

        setOriginalDeadline(new Date(deadline));

        setFormValues({
          ...formValues,
          formType: "edit",
          all_classes: all_classes,
          id,
          title,
          is_compulsory,
          credit,
          student_limit,
          deadline: new Date(deadline),

          outline,
          evaluation_standard,
          book,
        });

        setIsLoading(false);
      } else {
        setFormValues({
          ...formValues,
          all_classes: all_classes,
        });
      }
    };
    init();
  }, []);

  const getCourse = async () => {
    let url = `${process.env.REACT_APP_TEACHER_COURSE_API}${id}/`;
    return await axios
      .get(url, {})
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let msg = "????????????";
        const response = error.response;
        if (response && response.data && response.data.detail) {
          msg = response.data.detail;
        }
        enqueueSnackbar(msg, {
          variant: "error",
        });
        return [];
      });
  };

  const getClasses = async () => {
    let url = `${process.env.REACT_APP_TEACHER_CLASS_API}`;
    return await axios
      .get(url, {
        params: {
          get_all: true,
          is_active: true,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let msg = "????????????";
        const response = error.response;
        if (response && response.data && response.data.detail) {
          msg = response.data.detail;
        }
        enqueueSnackbar(msg, {
          variant: "error",
        });
        return [];
      });
  };

  return (
    <Card>
      <Card.Header>{type === "create" ? "????????????" : "????????????"}</Card.Header>
      <Card.Body>
        {!isLoading && (
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="title">
                <Form.Label>????????????</Form.Label>
                <Form.Control
                  type="text"
                  value={formValues.title}
                  name="title"
                  onChange={handleInputValue}
                  onBlur={handleInputValue}
                  isInvalid={!!errors["title"]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors["title"]}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="credit">
                <Form.Label>?????????</Form.Label>
                <Form.Control
                  type="number"
                  value={formValues.credit}
                  name="credit"
                  onChange={handleInputValue}
                  onBlur={handleInputValue}
                  isInvalid={!!errors["credit"]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors["credit"]}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Group as={Row}>
              <Form.Label as="is_compulsory" column sm={2}>
                ????????????
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="radio"
                  label="?????????"
                  name="is_compulsory"
                  value="true"
                  checked={formValues.is_compulsory}
                  onChange={handleInputValue}
                  disabled={type === "edit"}
                />
                <Form.Check
                  type="radio"
                  label="?????????"
                  name="is_compulsory"
                  value="false"
                  checked={!formValues.is_compulsory}
                  onChange={handleInputValue}
                  disabled={type === "edit"}
                />
              </Col>
            </Form.Group>

            {formValues.is_compulsory && type === "create" && (
              <Form.Group controlId="classes">
                <Form.Label>
                  ????????????
                  <Form.Text>
                    ????????????????????????????????????????????????????????????
                  </Form.Text>
                </Form.Label>

                <DualListBox
                  options={formValues.all_classes}
                  selected={formValues.classes}
                  onChange={handleClassesValue}
                  canFilter
                  filterPlaceholder="?????????????????????"
                  icons={{
                    moveLeft: "<",
                    moveAllLeft: "<<",
                    moveRight: ">",
                    moveAllRight: ">>",
                  }}
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{
                    display:
                      errors["classes"] && formValues.classes_change
                        ? "block"
                        : "hidden",
                  }}
                >
                  {errors["classes"]}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {formValues.is_compulsory && type === "edit" && (
              <Form.Group controlId="class">
                <Form.Label>??????</Form.Label>
                {/* <Form.Text as="p">{classInfo.name}</Form.Text> */}
                <Form.Control
                  type="text"
                  value={classInfo.name}
                  // readOnly
                  disabled
                />
              </Form.Group>
            )}
            {!formValues.is_compulsory && (
              <Form.Row>
                <Form.Group as={Col} controlId="student_limit">
                  <Form.Label>??????????????????</Form.Label>
                  <Form.Control
                    type="number"
                    value={formValues.student_limit}
                    name="student_limit"
                    onChange={handleInputValue}
                    onBlur={handleInputValue}
                    isInvalid={!!errors["student_limit"]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors["student_limit"]}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="deadline">
                  <Form.Label>????????????</Form.Label>

                  <DatePicker
                    className={`form-control ${
                      errors["deadline"] && formValues.deadline_change
                        ? "is-invalid"
                        : ""
                    }`}
                    dateFormat="yyyy/MM/dd"
                    minDate={type === "create" ? new Date() : originalDeadline}
                    name="deadline"
                    selected={formValues.deadline}
                    onChange={handleDeadlineValue}
                    onBlur={() => handleDeadlineValue(formValues.deadline)}
                  />

                  <Form.Control.Feedback
                    type="invalid"
                    style={{
                      display:
                        errors["deadline"] && formValues.deadline_change
                          ? "block"
                          : "hidden",
                    }}
                  >
                    {errors["deadline"]}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
            )}

            <Form.Group controlId="outline">
              <Form.Label>????????????</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formValues.outline}
                name="outline"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                isInvalid={!!errors["outline"]}
              />
              <Form.Control.Feedback type="invalid">
                {errors["outline"]}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="book">
              <Form.Label>????????????</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formValues.book}
                name="book"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                isInvalid={!!errors["book"]}
              />
              <Form.Control.Feedback type="invalid">
                {errors["book"]}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="evaluation_standard">
              <Form.Label>????????????</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formValues.evaluation_standard}
                name="evaluation_standard"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                isInvalid={!!errors["evaluation_standard"]}
              />
              <Form.Control.Feedback type="invalid">
                {errors["evaluation_standard"]}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleFormSubmit}
              disabled={!formIsValid()}
            >
              ??????
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default CourseForm;
