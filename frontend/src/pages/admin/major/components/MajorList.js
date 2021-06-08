import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "service/axiosConfig";

import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Moment from "react-moment";

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
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Icon from "@material-ui/core/Icon";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { FcCheckmark, FcCancel } from "react-icons/fc";

import {
  CommonLink,
  LinkWrapper,
  MainSearchForm,
  TableWapper,
} from "components/commom/CommonElements";
import MajorDeleteAlert from "./MajorDeleteAlert";
import { useDialog } from "providers/DialogProvider";

function createData({
  id,
  name,
  description,
  is_active,
  created_at,
  modified_at,
}) {
  return { id, name, description, is_active, created_at, modified_at };
}

const MajorList = () => {
  const token = useSelector((state) => state.user.token);
  const { enqueueSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(2);
  const [count, setCount] = React.useState(0);
  const [majors, setMajors] = React.useState([]);
  const location = useLocation();
  const { createDialog } = useDialog();

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    setDesc(parsed.desc ? String(parsed.desc) : "");
    setName(parsed.name ? String(parsed.name) : "");
  }, []);

  useEffect(() => {
    getMajorList();
  }, [name, desc, page, pageSize]);

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setName(event.target.value);
    }
    if (event.target.name === "desc") {
      setDesc(event.target.value);
    }
  };

  const openDeleteDialog = (major) => {
    createDialog({
      children: <MajorDeleteAlert handleDelete={handleDelete} major={major} />,
    });
  };

  const handleDelete = (major) => {
    const id = major.id;
    let url = `${process.env.REACT_APP_MAJOR_API}${id}/`;
    console.log(url);
    axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        enqueueSnackbar("删除成功", {
          variant: "success",
        });
        getMajorList();
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

  const getMajorList = (event) => {
    if (event) {
      event.preventDefault();
    }

    let url = process.env.REACT_APP_MAJOR_API;

    return axios
      .get(url, {
        params: {
          name: name,
          description: desc,
          page: page + 1,
          page_size: pageSize,
          ordering: "-id",
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        // console.log(response);
        return response.data;
      })
      .then((json) => {
        setCount(json.count);
        const data = json.results.map((item) => createData(item));
        setMajors(data);
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
    <>
      <Grid item xs={12}>
        <MainSearchForm>
          <TextField
            label="专业名词"
            name="name"
            onChange={handleChange}
            value={name}
            inputProps={{
              maxLength: 32,
            }}
          />
          <TextField
            label="专业描述"
            name="desc"
            onChange={handleChange}
            value={desc}
          />

          <IconButton type="button" aria-label="search" onClick={getMajorList}>
            <SearchIcon />
          </IconButton>
          <CommonLink to="/major/create">
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
                  <TableCell>名字</TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>是否激活</TableCell>
                  <TableCell>创建日期</TableCell>
                  <TableCell>修改日期</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {majors.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      {row.is_active ? <FcCheckmark /> : <FcCancel />}
                    </TableCell>
                    <TableCell>
                      <Moment format="YYYY/MM/DD HH:mm:ss">
                        {row.created_at}
                      </Moment>
                    </TableCell>
                    <TableCell>
                      <Moment format="YYYY/MM/DD HH:mm:ss">
                        {row.modified_at}
                      </Moment>
                    </TableCell>
                    <TableCell align="right">
                      <ButtonGroup
                        color="primary"
                        aria-label="outlined primary button group"
                      >
                        <LinkWrapper>
                          <CommonLink to={`/major/edit/${row.id}/`}>
                            {/* <CommonLink to={`/major/edit/${row.id}/`}> */}
                            <Icon>
                              <AiFillEdit />
                            </Icon>
                            {/* </CommonLink> */}
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

export default MajorList;
