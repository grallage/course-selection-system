import Cookies from "js-cookie";
import axios from "axios";

import React, { useState, useEffect } from "react";

import queryString from "query-string";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Switch from "@material-ui/core/Switch";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { SwitchLabel } from "./MajorFormElements";

import { ButtonGroup } from "@material-ui/core";

export default function MajorForm({ type }) {
  // const classes = useStyles();
  const dispatch = useDispatch();
  let history = useHistory();
  let location = useLocation();
  const { id } = useParams();

  const parsed = queryString.parse(location.search);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (type === "edit") {
      console.log("编辑");
      getMajor();
    }
  }, []);

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setName(event.target.value);
    }
    if (event.target.name === "description") {
      setDescription(event.target.value);
    }
    if (event.target.name === "isActive") {
      setIsActive(event.target.checked);
    }
  };

  const handleSubmitAndReturnToListPage = (event) => {
    const result = handleSubmit(event);
    console.log("result:");
    console.log(result);
    if (result) {
      history.push("/major");
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    let url =
      type === "create"
        ? process.env.REACT_APP_MAJOR_API
        : `${process.env.REACT_APP_MAJOR_API}${id}/`;

    let form = new FormData();
    form.append("name", name);
    form.append("description", description);
    form.append("is_active", isActive);

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.withCredentials = true;

    var csrfCookie = Cookies.get("csrftoken");
    // console.log(csrfCookie);
    return (
      axios({
        method: type === "create" ? "post" : "put",
        url: url,
        data: form,
        header: {
          "Content-Type": "application/json",
        },
      })
        // return axios
        //   .post(url, form, {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   })
        .then((response) => {
          console.log(response);
          return response.data;
        })
        .then((json) => {
          console.log(json);
          if (type === "create") {
            setDescription("");
            setName("");
            setIsActive(true);
          } else {
            getMajor();
          }

          return true;
        })
        .catch((error) => {
          console.log("錯誤");
          console.log(error);
          return false;
        })
    );
  };

  const getMajor = () => {
    let url = `${process.env.REACT_APP_MAJOR_API}${id}/`;

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        console.log(json);
        setDescription(json.description);
        setName(json.name);
        setIsActive(json.is_active);
        return true;
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error);
        return false;
      });
  };

  return (
    <>
      {/* <form className={classes.root} noValidate autoComplete="off"> */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          创建专业
        </Typography>
      </Grid>
      {/* <Grid container spacing={3}> */}

      <Grid item xs={12}>
        <TextField
          required
          name="name"
          label="专业名称"
          fullWidth
          variant="outlined"
          value={name}
          onChange={handleChange}
          inputProps={{
            maxLength: 32,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="description"
          label="专业描述"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <SwitchLabel
          control={
            <Switch
              //   checked={state.checkedA}
              checked={isActive}
              onChange={handleChange}
              name="isActive"
              required
            />
          }
          labelPlacement="start"
          label="是否激活"
        />
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
