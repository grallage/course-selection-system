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
import { ButtonGroup, Button } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

import { AiFillEdit, AiFillDelete, AiFillInfoCircle } from "react-icons/ai";
import { FcCheckmark, FcCancel } from "react-icons/fc";

import {
  CommonLink,
  LinkWrapper,
  MainSearchForm,
  TableWapper,
} from "../../../../components/commom/CommonElements";
import TeacherDeleteAlert from "./TeacherDeleteAlert";
import { useDialog } from "../../../../providers/DialogProvider";
import TeacherInfoAlert from "./TeacherInfoAlert";
import TeacherEditAlert from "./TeacherEditAlert";

function createData({ user, code, domain, office }) {
  return { user, code, domain, office };
}

const initialSearchForm = {
  name: "",
  phone: "",
};

const TeacherList = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchForm, setSearchForm] = React.useState(initialSearchForm);

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [count, setCount] = React.useState(0);
  const [teachers, setTeachers] = React.useState([]);
  const location = useLocation();

  const { createDialog, closeDialog } = useDialog();

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    getTeacherList();
  }, [page, pageSize]);

  useEffect(() => {
    getTeacherList();
  }, [searchForm]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSearchForm({ [name]: value });
  };

  const openDeleteDialog = (teacher) => {
    createDialog({
      children: (
        <TeacherDeleteAlert handleDelete={handleDelete} teacher={teacher} />
      ),
    });
  };
  const openInfoDialog = (teacher) => {
    createDialog({
      children: <TeacherInfoAlert teacher={teacher} />,
    });
  };
  const openEditDialog = (teacher) => {
    createDialog({
      children: (
        <TeacherEditAlert
          teacher={teacher}
          type="edit"
          getTeacherList={getTeacherList}
        />
      ),
    });
  };
  const openCreateDialog = (teacher) => {
    createDialog({
      children: (
        <TeacherEditAlert type="create" getTeacherList={getTeacherList} />
      ),
    });
  };

  const handleDelete = (teacher) => {
    const id = teacher.user.id;
    let url = `${process.env.REACT_APP_TEACHER_API}${id}/`;
    console.log(url);
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
        getTeacherList();
      })
      .catch((error) => {
        console.log("錯誤");
        enqueueSnackbar("操作失败", {
          variant: "error",
        });
        console.log(error);
      });
  };

  const getTeacherList = (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log(page);
    let url = process.env.REACT_APP_TEACHER_API;

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
        console.log(json);
        setCount(json.count);

        const data = json.results.map((item) => createData(item));
        // console.log(data);
        setTeachers(data);
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
            label="教师名称"
            name="full_name"
            onChange={handleChange}
            value={searchForm.name}
            inputProps={{
              maxLength: 32,
            }}
          />

          <IconButton
            type="button"
            aria-label="search"
            onClick={getTeacherList}
          >
            <SearchIcon />
          </IconButton>
          {/* <CommonLink to="/teacher/create"> */}
          <LinkWrapper onClick={() => openCreateDialog()}>
            {/* <CommonLink > */}
            <IconButton type="button" aria-label="create">
              <AddCircleOutlineIcon />
            </IconButton>
            {/* </CommonLink> */}
          </LinkWrapper>
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

                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((row) => (
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

                    <TableCell align="right">
                      <ButtonGroup
                        color="primary"
                        aria-label="outlined primary button group"
                      >
                        <LinkWrapper onClick={() => openInfoDialog(row)}>
                          <Link variant="button">
                            <Icon>
                              <AiFillInfoCircle />
                            </Icon>
                          </Link>
                        </LinkWrapper>

                        <LinkWrapper onClick={() => openEditDialog(row)}>
                          {/* <CommonLink to={`/teacher/edit/${row.id}/`}> */}
                          {/* <CommonLink to={`/teacher/edit/${row.id}/`}> */}
                          <Link variant="button">
                            <Icon>
                              <AiFillEdit />
                            </Icon>
                          </Link>
                          {/* </CommonLink> */}
                          {/* </CommonLink> */}
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

export default TeacherList;