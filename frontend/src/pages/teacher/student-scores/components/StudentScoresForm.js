import React, { useEffect } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";

// table
// https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
// https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/about.html
// https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/table-props.html
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { Row, Col, Form } from "react-bootstrap";
import {
  Card,
  SearchContainer,
} from "components-teacher/common/CommonElements";
import Pagination from "components-teacher/Pagination/Pagination";

const columns = [
  {
    dataField: "id",
    text: "#",
  },
  {
    dataField: "title",
    text: "课程名称",
  },
  {
    dataField: "is_compulsory",
    text: "必修/选修",
  },
  {
    dataField: "class_name",
    text: "班级",
  },
];

const numberValidation = (newValue, row, column) => {
  if (isNaN(newValue)) {
    return {
      valid: false,
      message: "请输入数字",
    };
  }
  if (newValue < 0.0) {
    return {
      valid: false,
      message: "必须大于0",
    };
  }
  if (newValue > 100.0) {
    return {
      valid: false,
      message: "必须小于100",
    };
  }
  return true;
};

const columns2 = [
  {
    dataField: "id",
    text: "#",
  },
  {
    dataField: "student_code",
    text: "学号",
    editable: false,
  },
  {
    dataField: "student_name",
    text: "姓名",
    editable: false,
  },
  {
    dataField: "student_sex",
    text: "性别",
    editable: false,
  },
  {
    dataField: "student_class_name",
    text: "班级",
    editable: false,
  },
  {
    dataField: "student_grade1",
    text: "平时成绩",
    type: "number",
    validator: numberValidation,
  },
  {
    dataField: "student_grade2",
    text: "期中成绩",
    type: "number",
    validator: numberValidation,
  },
  {
    dataField: "student_grade3",
    text: "期末成绩",
    type: "number",
    validator: numberValidation,
  },
  {
    dataField: "grade",
    text: "总成绩",
    type: "number",
    validator: numberValidation,
  },
  {
    dataField: "credit",
    text: "获得学分数",
    type: "number",
    validator: numberValidation,
  },
  {
    dataField: "comment",
    text: "教师评语",
    editor: {
      type: Type.TEXTAREA,
    },
  },
  {
    dataField: "grade_result",
    text: "成绩结果",
    editor: {
      type: Type.SELECT,
      options: [
        {
          value: "待定",
          label: "待定",
        },
        {
          value: "通过",
          label: "通过",
        },
        {
          value: "重修",
          label: "重修",
        },
      ],
    },
  },
];

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
  return {
    id,
    title,
    teacher,
    credit,
    student_limit,
    deadline,
    class_name: class_info ? class_info.name : "-",
    is_compulsory: is_compulsory ? "必修" : "选修",
  };
}

function createStudentCourseData(data) {
  return {
    ...data,
    student_sex:
      data.student_sex === "FEMALE"
        ? "女"
        : data.student_sex === "MALE"
        ? "男"
        : "-",
    grade_result:
      data.grade_result === "DEFAULT"
        ? "待定"
        : data.grade_result === "PASS"
        ? "通过"
        : "重修",
  };
}

const initialSearchForm = {
  course_name: "",
  class_name: "",
};

const StudentScoresForm = () => {
  const [courses, setCourses] = React.useState([]);
  const [courseId, setCourseId] = React.useState(-1);
  const [rowId, setRowId] = React.useState(-1);
  const [courseStudents, setCourseStudents] = React.useState([]);
  const [searchForm, setSearchForm] = React.useState(initialSearchForm);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [count, setCount] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();

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
        // console.log(data);
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
  const getStudentCourseList = (row) => {
    if (courseId === row.id) {
      return;
    }
    let url = process.env.REACT_APP_TEACHER_STUDENT_COURSE_API;
    axios
      .get(url, {
        params: {
          course_id: row.id,
          get_all: true,
          ordering: "-id",
        },
      })
      .then((response) => {
        let json = response.data;
        if (json.length > 0) {
          json = json.map((item) => createStudentCourseData(item));
        }
        setCourseId(row.id);
        // console.log(json);
        setCourseStudents(json);

        return json;
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

  const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.id === rowId) {
      style.backgroundColor = "#c8e6c9";
    }

    // if (rowIndex > 2) {
    //   style.fontWeight = 'bold';
    //   style.color = 'white';
    // }

    return style;
  };

  const expandRow = {
    onlyOneExpanding: true,
    renderer: (row) => {
      getStudentCourseList(row);
      setRowId(row.id);
      const cellEdit = cellEditFactory({
        mode: "click",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (oldValue === newValue) {
            return;
          }
          let url = `${process.env.REACT_APP_TEACHER_STUDENT_COURSE_API}${row.id}/`;

          let form = new FormData();
          form.append("comment", row.comment);
          form.append("credit", row.credit);
          form.append("grade", row.grade);
          form.append(
            "grade_result",
            row.grade_result === "通过"
              ? "PASS"
              : row.grade_result === "重修"
              ? "FAIL"
              : "DEFAULT"
          );
          form.append("student_grade1", row.student_grade1);
          form.append("student_grade2", row.student_grade2);
          form.append("student_grade3", row.student_grade3);
          axios({
            method: "put",
            url: url,
            data: form,
          })
            .then((response) => {
              console.log(response);
              return response.data;
            })
            .then((json) => {
              enqueueSnackbar("编辑成功", {
                variant: "success",
              });
              return true;
            })
            .catch((error) => {
              let msg = "操作失败";
              const response = error.response;
              if (response && response.data && response.data.detail) {
                msg = response.data.detail;
              }
              if (response && response.data && response.data.msg) {
                msg = response.data.msg;
              }
              enqueueSnackbar(msg, {
                variant: "error",
              });
              return false;
            });
        },
      });

      return (
        <>
          {/* <Card> */}
          <Card.Header>
            <Row>
              <Col>学生信息</Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {courseStudents.length > 0 && (
              <BootstrapTable
                keyField="id"
                striped
                hover
                condensed
                data={courseStudents}
                columns={columns2}
                cellEdit={cellEdit}
              />
            )}
          </Card.Body>
          {/* </Card> */}
        </>
      );
    },
  };

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>成绩管理</Col>
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
          </Row>
        </SearchContainer>
      </Card.Header>

      <Card.Body>
        <BootstrapTable
          keyField="id"
          //   striped
          //   hover
          //   condensed
          bordered={false}
          data={courses}
          columns={columns}
          expandRow={expandRow}
          rowStyle={rowStyle}
        />
      </Card.Body>

      <Pagination
        page={page}
        pageSize={pageSize}
        count={count}
        handlePaginationChange={handlePaginationChange}
        Wrapper={Card.Footer}
      />
    </Card>
  );
};

export default StudentScoresForm;
