import Cookies from "js-cookie";
import axios from "axios";
import { useSnackbar } from "notistack";
import queryString from "query-string";

import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";

import { useHistory, useLocation, useParams } from "react-router-dom";
import { ButtonGroup } from "@material-ui/core";

export default function ClassForm({ type }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let history = useHistory();
  let location = useLocation();
  const { id } = useParams();

  const parsed = queryString.parse(location.search);

  const [classCount, setClassCount] = useState();
  const [classCountError, setClassCountError] = useState("");
  const [majorId, setMajorId] = useState(-1);
  const [majors, setMajors] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  useEffect(() => {
    getMajor();
    if (type === "edit") {
      console.log("编辑");
    }
  }, []);

  const handleChange = (event) => {
    console.log(event.target.name);
    console.log(event.target.value);
    if (event.target.name === "classCount") {
      let number = event.target.value;
      if (number) {
        number = Math.min(Math.max(number, 1), 10);
      }
      setClassCountError("");
      setClassCount(number);
    }
    if (event.target.name === "major") {
      setMajorId(event.target.value);
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmitAndReturnToListPage = (event) => {
    handleSubmit(event).then((result) => {
      if (result) {
        console.log("result:");
        console.log(result);
        history.push("/class");
      }
    });
  };

  const validCreateForm = () => {
    if (!classCount) {
      setClassCountError("班级个数不能为空");
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validCreateForm()) {
      return false;
    }

    let url =
      type === "create"
        ? process.env.REACT_APP_CLASS_API
        : `${process.env.REACT_APP_CLASS_API}${id}/`;

    let form = new FormData();
    form.append("majorId", majorId);
    form.append("year", selectedDate.toISOString());
    form.append("classCount", classCount);
    console.log(majorId, selectedDate, classCount);

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.withCredentials = true;

    var csrfCookie = Cookies.get("csrftoken");

    return axios({
      method: type === "create" ? "post" : "put",
      url: url,
      data: form,
      header: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .then((json) => {
        console.log(json);
        if (type === "create") {
          enqueueSnackbar("创建成功", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("编辑成功", {
            variant: "success",
          });
        }

        return true;
      })
      .catch((error) => {
        let msg = "操作失败";
        if (error.response) {
          msg = error.response.data.msg;
        }

        enqueueSnackbar(msg, {
          variant: "error",
        });
        return false;
      });
  };

  const getMajor = () => {
    let url = `${process.env.REACT_APP_MAJOR_API}`;
    return axios
      .get(url, {
        params: {
          get_all: true,
          is_active: true,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        setMajors(json);
        if (json.length > 0) {
          setMajorId(json[0].id);
        }
        return json;
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error.response);
        return [];
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          创建班级
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          required
          error={classCountError !== ""}
          helperText={classCountError}
          name="classCount"
          label="班级个数"
          fullWidth
          variant="outlined"
          value={classCount}
          onChange={handleChange}
          type="number"
          placeholder="每届每个专业班级最多为10个"
          autoFocus
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl variant="outlined" fullWidth>
          {/* <FormControl fullWidth> */}
          <InputLabel required>专业</InputLabel>
          <Select
            required
            name="major"
            value={majorId}
            onChange={handleChange}
            label="专业"
            fullWidth
          >
            {majors.map((row) => (
              <MenuItem value={row.id} key={row.id}>
                {row.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl variant="outlined" fullWidth>
          {/* <FormControl fullWidth> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              margin="normal"
              label="班级创立时间"
              format="yyyy"
              fullWidth
              name="year"
              views={["year"]}
              value={selectedDate}
              onChange={handleDateChange}
              okLabel="确定"
              clearLabel="清除"
              cancelLabel="取消"
              minDate={new Date().setFullYear(new Date().getFullYear() - 10)}
              maxDate={new Date()}
              inputVariant="outlined"
              style={{ margin: 0 }}
              required
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button onClick={handleSubmit}>提交</Button>
          <Button onClick={handleSubmitAndReturnToListPage}>
            提交並返回列表頁
          </Button>
        </ButtonGroup>
      </Grid>
      {/* </Grid> */}
      {/* </form> */}
    </>
  );
}
