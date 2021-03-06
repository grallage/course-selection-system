import React, { useEffect } from "react";
import axios from "service/axiosConfig";

import { useSnackbar } from "notistack";

// import queryString from "query-string";

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

import { AiFillEdit, AiFillDelete } from "react-icons/ai";

import {
  CommonLink,
  LinkWrapper,
  MainSearchForm,
  TableWapper,
} from "components/commom/CommonElements";
import StudentDeleteAlert from "./StudentDeleteAlert";
import { useDialog } from "providers/DialogProvider";

function createData({ user, code, class_info }) {
  return { user, code, class_info };
}

const initialSearchForm = {
  name: "",
  phone: "",
};

const StudentList = () => {
  const { enqueueSnackbar } = useSnackbar();
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchForm, setSearchForm] = React.useState(initialSearchForm);

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [count, setCount] = React.useState(0);
  const [students, setStudents] = React.useState([]);
  // const location = useLocation();

  const { createDialog } = useDialog();

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    // const parsed = queryString.parse(location.search);
    getStudentList();
  }, [page, pageSize]);

  useEffect(() => {
    getStudentList();
  }, [searchForm]);

  const handleChange = (event) => {
    const { name, value } = event.target;
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
      .delete(url)
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        enqueueSnackbar("????????????", {
          variant: "success",
        });
        getStudentList();
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
      });
  };

  const getStudentList = (event) => {
    if (event) {
      event.preventDefault();
    }

    let url = process.env.REACT_APP_STUDENT_API;

    return axios
      .get(url, {
        params: {
          full_name: searchForm.full_name,
          class_name: searchForm.class_name,
          page: page + 1,
          page_size: pageSize,
          ordering: "-id",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        setCount(json.count);
        const data = json.results.map((item) => createData(item));

        setStudents(data);
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
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <MainSearchForm>
          <TextField
            label="????????????"
            name="full_name"
            onChange={handleChange}
            value={searchForm.name}
            inputProps={{
              maxLength: 32,
            }}
          />
          <TextField
            label="????????????"
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
                  <TableCell>??????</TableCell>
                  <TableCell>??????</TableCell>
                  <TableCell>??????</TableCell>
                  <TableCell>????????????</TableCell>
                  <TableCell>??????</TableCell>

                  <TableCell align="right">??????</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((row) => (
                  <TableRow key={row.user.id}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.user.full_name}</TableCell>
                    <TableCell>
                      {row.user.sex === "MALE"
                        ? "???"
                        : row.user.sex === "FEMALE"
                        ? "???"
                        : "?????????"}
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
          />
        </Paper>
      </Grid>
    </>
  );
};

export default StudentList;
