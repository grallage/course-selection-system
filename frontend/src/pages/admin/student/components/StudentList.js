import React, { useEffect } from "react";
import axios from "axios";

import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import Link from "@material-ui/core/Link";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { ButtonGroup } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

import { AiFillEdit, AiFillDelete, AiFillInfoCircle } from "react-icons/ai";

import {
  CommonLink,
  LinkWrapper,
  MainSearchForm,
  TableWapper,
} from "../../../../components/commom/CommonElements";
import StudentDeleteAlert from "./StudentDeleteAlert";
import { useDialog } from "../../../../providers/DialogProvider";

function createData({ user, code, class_info }) {
  return { user, code, class_info };
}

const initialSearchForm = {
  name: "",
  phone: "",
};

const StudentList = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchForm, setSearchForm] = React.useState(initialSearchForm);

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [count, setCount] = React.useState(0);
  const [students, setStudents] = React.useState([]);
  const location = useLocation();

  const { createDialog, closeDialog } = useDialog();

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    getStudentList();
  }, [page, pageSize]);

  useEffect(() => {
    getStudentList();
  }, [searchForm]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSearchForm({ [name]: value });
  };

  const openDeleteDialog = (student) => {
    createDialog({
      children: (
        <StudentDeleteAlert handleDelete={handleDelete} student={student} />
      ),
    });
  };

  const handleDelete = (student) => {
    const id = student.user.id;
    let url = `${process.env.REACT_APP_STUDENT_API}${id}/`;

    axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        enqueueSnackbar("删除成功", {
          variant: "success",
        });
        getStudentList();
      })
      .catch((error) => {
        console.log("錯誤");
        enqueueSnackbar("操作失败", {
          variant: "error",
        });
        console.log(error);
      });
  };

  const getStudentList = (event) => {
    if (event) {
      event.preventDefault();
    }

    let url = process.env.REACT_APP_STUDENT_API;

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.withCredentials = true;

    // var csrfCookie = Cookies.get("csrftoken");
    // console.log(csrfCookie);
    return axios
      .get(
        url,
        {
          params: {
            full_name: searchForm.full_name,
            class_name: searchForm.class_name,
            page: page + 1,
            page_size: pageSize,
            ordering: "-id",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        return response.data;
      })
      .then((json) => {
        setCount(json.count);
        const data = json.results.map((item) => createData(item));
        // console.log(data);
        setStudents(data);
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error);
      });
  };

  return (
    <>
      <Grid item xs={12}>
        {/* <Paper component="form"> */}
        <MainSearchForm>
          <TextField
            label="学生名称"
            name="full_name"
            onChange={handleChange}
            value={searchForm.name}
            inputProps={{
              maxLength: 32,
            }}
          />
          <TextField
            label="班级名称"
            name="class_name"
            onChange={handleChange}
            value={searchForm.class_name}
            inputProps={{
              maxLength: 32,
            }}
          />

          <IconButton
            type="button"
            aria-label="search"
            onClick={getStudentList}
          >
            <SearchIcon />
          </IconButton>
          <CommonLink to="/student/create">
            <IconButton type="button" aria-label="create">
              <AddCircleOutlineIcon />
            </IconButton>
          </CommonLink>
        </MainSearchForm>
        {/* </Paper> */}
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <TableContainer>
            <TableWapper size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>编号</TableCell>
                  <TableCell>名称</TableCell>
                  <TableCell>性别</TableCell>
                  <TableCell>联系电话</TableCell>
                  <TableCell>班级</TableCell>

                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((row) => (
                  <TableRow key={row.user.id}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.user.full_name}</TableCell>
                    <TableCell>
                      {row.user.sex === "MALE"
                        ? "男"
                        : row.user.sex === "FEMALE"
                        ? "女"
                        : "未设定"}
                    </TableCell>
                    <TableCell>{row.user.phone}</TableCell>
                    <TableCell>{row.class_info.name}</TableCell>

                    <TableCell align="right">
                      <ButtonGroup
                        color="primary"
                        aria-label="outlined primary button group"
                      >
                        <LinkWrapper>
                          <CommonLink to={`/student/edit/${row.user.id}/`}>
                            <Link variant="button">
                              <Icon>
                                <AiFillEdit />
                              </Icon>
                            </Link>
                          </CommonLink>
                        </LinkWrapper>

                        {/* <LinkWrapper onClick={() => handleDelete(row.id)}> */}
                        <LinkWrapper onClick={() => openDeleteDialog(row)}>
                          <Link variant="button">
                            <Icon>
                              <AiFillDelete />
                            </Icon>
                          </Link>
                        </LinkWrapper>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWapper>
          </TableContainer>
          <TablePagination
            // rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={3}
            count={count} //{rows.length}
            rowsPerPage={pageSize}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onChangePage={(event, newPage) => {
              setPage(newPage);
            }}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            // ActionsComponent={TablePaginationActions}
          />
        </Paper>
      </Grid>
    </>
  );
};

export default StudentList;
