import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Card, DatePicker } from "components-teacher/common/CommonElements";
import { Button, Form, Col, Row } from "react-bootstrap";

import { useFormControls } from "./PasswordFormControls";

function createData(item) {
  return { value: item.id, label: item.name };
}

const PasswordForm = ({ type }) => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleDateValue,
    handleFormSubmit,
    formIsValid,
  } = useFormControls();

  useEffect(async () => {
    setFormValues({
      ...formValues,
      id: user.id,
      token,
    });
  }, []);

  return (
    <Card>
      <Card.Header>更改密码</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId="password">
            <Form.Label>密码</Form.Label>
            <Form.Control
              type="password"
              value={formValues.password}
              name="password"
              onChange={handleInputValue}
              onBlur={handleInputValue}
              isInvalid={!!errors["password"]}
            />
            <Form.Control.Feedback type="invalid">
              {errors["password"]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="new_password1">
            <Form.Label>新密码</Form.Label>
            <Form.Control
              type="password"
              value={formValues.new_password1}
              name="new_password1"
              onChange={handleInputValue}
              onBlur={handleInputValue}
              isInvalid={!!errors["new_password1"]}
            />
            <Form.Control.Feedback type="invalid">
              {errors["new_password1"]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="new_password2">
            <Form.Label>确认新密码</Form.Label>
            <Form.Control
              type="password"
              value={formValues.new_password2}
              name="new_password2"
              onChange={handleInputValue}
              onBlur={handleInputValue}
              isInvalid={!!errors["new_password2"]}
            />
            <Form.Control.Feedback type="invalid">
              {errors["new_password2"]}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleFormSubmit}
            disabled={!formIsValid()}
          >
            提交
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PasswordForm;