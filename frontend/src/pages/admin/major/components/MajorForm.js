import Cookies from "js-cookie";
import axios from "axios";
import { useSnackbar } from "notistack";
import queryString from "query-string";

import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { useHistory, useLocation, useParams } from "react-router-dom";
import { ButtonGroup } from "@material-ui/core";

import { SwitchLabel } from "./MajorFormElements";

export default function MajorForm({ type }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
    handleSubmit(event).then((result) => {
      if (result) {
        console.log("result:");
        console.log(result);
        history.push("/major");
      }
    });
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
          setDescription("");
          setName("");
          setIsActive(true);
          enqueueSnackbar("创建成功", {
            variant: "success",
          });
        } else {
          getMajor();
          enqueueSnackbar("编辑成功", {
            variant: "success",
          });
        }

        return true;
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error);
        enqueueSnackbar("操作失败", {
          variant: "error",
        });
        return false;
      });
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
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          创建专业
        </Typography>
      </Grid>

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
