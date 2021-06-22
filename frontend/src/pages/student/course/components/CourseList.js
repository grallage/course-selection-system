import React, { useEffect } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useModal } from "providers/DialogBootstrapProvider";

import { Table, Row, Col, Form, ButtonGroup, Button } from "react-bootstrap";
import {
  Card,
  SearchContainer,
} from "components-teacher/common/CommonElements";
import Pagination from "components-teacher/Pagination/Pagination";
import CourseDetailAlert from "./CourseDetailAlert";

function createData(item) {
  return {
    // teacher
    teacher_id: item.teacher.user.id,
    teacher_name: item.teacher.user.full_name,
    // course
    title: item.title,
    book: item.book,
    credit: item.credit,
    deadline: item.deadline,
    endtime: item.endtime,
    evaluation_standard: item.evaluation_standard,
    id: item.id,
    is_compulsory: item.is_compulsory,
    outline: item.outline,
    student_limit: item.student_limit,
    // course_student
    comment: item.student_course.comment,
    student_credit: item.student_course.credit,
    grade: item.student_course.grade,
    grade_result: item.student_course.grade_result,
    student_comment: item.student_course.student_comment,
    student_grade1: item.student_course.student_grade1,
    student_grade2: item.student_course.student_grade2,
    student_grade3: item.student_course.student_grade3,
  };
}

const initialSearchForm = {
  course_name: "",
  class_name: "",
};

const CourseList = () => {
  const [courses, setCourses] = React.useState([]);
  const [searchForm, setSearchForm] = React.useState(initialSearchForm);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [count, setCount] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const { createModal } = useModal();

  useEffect(() => {
    getCourseList();
  }, [searchForm, page]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setPage(1);
    setSearchForm({ [name]: value });
  };
  const handlePaginationChange = ({ page }) => {
    setPage(page);
  };

  const getCourseList = (event) => {
    if (event) {
      event.preventDefault();
    }

    let url = process.env.REACT_APP_STUDENT_COURSE_API;

    return axios
      .get(url, {
        params: {
          course_name: searchForm.course_name,
          class_name: searchForm.class_name,

          page: page,
          page_size: pageSize,
          ordering: "-id",
        },
      })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      })
      .then((json) => {
        console.log(json);
        setCount(json.count);
        const data = json.results.map((item) => createData(item));
        console.log(data);
        setCourses(data);
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

  const openDetailModal = (item) => {
    createModal({
      children: <CourseDetailAlert course={item} />,
    });
  };

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>课程列表</Col>
        </Row>

        <SearchContainer>
          <Row>
            <Col>
              <Form.Control
                placeholder="课程名称"
                name="course_name"
                onChange={handleChange}
                value={searchForm.course_name}
              />
            </Col>

            <Col className="end">
              <ButtonGroup></ButtonGroup>
            </Col>
          </Row>
        </SearchContainer>
      </Card.Header>

      <Card.Body>
        <Table striped bordered hover responsive="md">
          <thead>
            <tr>
              <th>#</th>
              <th>课程名称</th>
              <th>教师</th>
              <th>必修/选修</th>
              <th>课程学分</th>
              <th>获得学分</th>

              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.teacher_name}</td>
                <td>{item.is_compulsory ? "必修" : "选修"}</td>
                <td>{item.credit}</td>
                <td>{item.student_credit === 0 ? "-" : item.student_credit}</td>
                <td>
                  <ButtonGroup>
                    <Button
                      variant="outline-primary"
                      onClick={() => openDetailModal(item)}
                    >
                      查看
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      {/* <Card.Footer> */}
      <Pagination
        page={page}
        pageSize={pageSize}
        count={count}
        handlePaginationChange={handlePaginationChange}
        Wrapper={Card.Footer}
      />
      {/* </Card.Footer> */}
    </Card>
  );
};

export default CourseList;
