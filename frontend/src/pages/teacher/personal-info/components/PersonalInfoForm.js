import React, { useEffect, useState } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

import { UpdateUser } from "../../../../redux/actions/userAction";

import { Card } from "components-teacher/common/CommonElements";
import { Button, Form } from "react-bootstrap";

import { useFormControls } from "./PersonalInfoFormControls";

function createData(item) {
  return {
    code: item.code,
    domain: item.domain,
    office: item.office,
    address: item.user.address,
    email: item.user.email,
    full_name: item.user.full_name,
    id: item.user.id,
    phone: item.user.phone,
    sex: item.user.sex,
  };
}

const PersonalInfoForm = () => {
  const [teacher, setTeacher] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state) => state.user.user.id);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleFormSubmit,
    formIsValid,
  } = useFormControls();

  useEffect(async () => {
    const data = createData(await getTeacherInfo());
    setTeacher(data);
    setFormValues({
      ...formValues,
      id: data.id,
      domain: data.domain,
      office: data.office,
      address: data.address,
      phone: data.phone,
    });
    dispatch(UpdateUser(data));
    setIsLoading(false);
  }, []);

  const getTeacherInfo = async () => {
    let url = `${process.env.REACT_APP_TEACHER_TEACHER_API}${userId}`;

    return axios
      .get(url)
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
      });
  };

  return (
    <Card>
      <Card.Header>基本信息</Card.Header>
      <Card.Body>
        {!isLoading && (
          <Form>
            <Form.Group>
              <Form.Label>姓名</Form.Label>
              <Form.Control type="text" value={teacher.full_name} disabled />
            </Form.Group>

            <Form.Group>
              <Form.Label>教师编号</Form.Label>
              <Form.Control type="text" value={teacher.code} disabled />
            </Form.Group>

            <Form.Group>
              <Form.Label>邮箱地址</Form.Label>
              <Form.Control type="text" value={teacher.email} disabled />
            </Form.Group>

            {/* <Form.Group>
              <Form.Label>性别</Form.Label>
              <Form.Control type="text" value={teacher.sex} disabled />
            </Form.Group> */}

            <Form.Group>
              <Form.Label>性别</Form.Label>
              {/* <Row> */}
              <Form.Check
                type="radio"
                label="男"
                name="sex"
                value="FAMALE"
                checked={teacher.sex === "MALE"}
                onChange={handleInputValue}
                disabled
              />
              <Form.Check
                type="radio"
                label="女"
                name="sex"
                value="MALE"
                checked={teacher.sex === "FEMALE"}
                onChange={handleInputValue}
                disabled
              />
              <Form.Check
                type="radio"
                label="待设定"
                name="sex"
                value="SECRET"
                checked={teacher.sex === "SECRET"}
                onChange={handleInputValue}
                disabled
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>电话号码</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formValues.phone}
                onChange={handleInputValue}
                onBlur={handleInputValue}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>住址</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formValues.address}
                onChange={handleInputValue}
                onBlur={handleInputValue}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>擅长领域</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="domain"
                value={formValues.domain}
                onChange={handleInputValue}
                onBlur={handleInputValue}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>办公室</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="office"
                value={formValues.office}
                onChange={handleInputValue}
                onBlur={handleInputValue}
              />
            </Form.Group>

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

export default PersonalInfoForm;
