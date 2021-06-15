import React, { useEffect } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useModal } from "providers/DialogBootstrapProvider";

import {
  Table,
  Container,
  Row,
  Col,
  Form,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import {
  Card,
  SearchContainer,
  Link,
} from "components-teacher/common/CommonElements";
import Pagination from "components-teacher/Pagination/Pagination";
import CourseDeleteAlert from "./CourseDeleteAlert";

function createData({
  id,
  title,
  teacher,
  class_info,
  is_compulsory,
  credit,
  student_limit,
  deadline,
}) {
  // const class_name = class_info.name;
  return {
    id,
    title,
    teacher,
    class_info,
    is_compulsory,
    credit,
    student_limit,
    deadline,
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

    let url = process.env.REACT_APP_TEACHER_COURSE_API;

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
        setCount(json.count);
        const data = json.results.map((item) => createData(item));
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

  const openDeleteModal = (course) => {
    createModal({
      children: (
        <CourseDeleteAlert handleDelete={handleDelete} course={course} />
      ),
    });
  };

  const handleDelete = (course) => {
    const id = course.id;
    let url = `${process.env.REACT_APP_TEACHER_COURSE_API}${id}/`;

    axios
      .delete(url, {})
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        enqueueSnackbar("删除成功", {
          variant: "success",
        });
        getCourseList();
      })
      .catch((error) => {
        let msg = "操作失败";
        const response = error.response;
        if (response && response.data && response.data.detail) {
          msg = response.data.detail;
        }
        enqueueSnackbar(msg, {
          variant: "error",
        });
      });
  };

  return (
    <Card>
      <Card.Header>
        {/* <Container fluid="md"> */}
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
            <Col>
              <Form.Control
                placeholder="班级名称"
                name="class_name"
                onChange={handleChange}
                value={searchForm.class_name}
              />
            </Col>
            <Col className="end">
              <ButtonGroup>
                <Link to="/course/create">
                  <Button variant="info">创建</Button>
                </Link>
              </ButtonGroup>
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
              <th>班级/学生上限</th>
              <th>选课限期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.teacher}</td>
                <td>{item.is_compulsory ? "必修" : "选修"}</td>
                <td>{item.credit}</td>
                <td>
                  {item.is_compulsory
                    ? item.class_info.name
                    : `${item.student_limit}人`}
                </td>
                <td>
                  {item.deadline
                    ? // ? new Date(item.deadline).toISOString().slice(0, 10)
                      // https://ououe.com/posts/2019/12/06/tolocalestring/
                      new Date(item.deadline).toLocaleString("zh-CN", {
                        dateStyle: "full",
                        timeZone: "Asia/Shanghai",
                      })
                    : "-"}
                </td>
                <td>
                  <ButtonGroup>
                    <Link to={`/course/edit/${item.id}`}>
                      <Button variant="outline-primary">编辑</Button>
                    </Link>
                    <Button
                      variant="outline-danger"
                      onClick={() => openDeleteModal(item)}
                    >
                      刪除
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
