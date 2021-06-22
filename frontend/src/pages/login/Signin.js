// import Cookies from "js-cookie";
import axios from "axios";

import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AddToken, AddUser } from "../../redux/actions/userAction";

import { useSnackbar } from "notistack";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Lynn Demo Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const hasLogin = useSelector((state) =>
    state.user.token && state.user && state.user.user && state.user.user.id
      ? true
      : false
  );

  useEffect(() => {
    if (hasLogin) {
      history.push("/");
    }
  }, []);

  const handleChange = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
    if (event.target.name === "pwd") {
      setPwd(event.target.value);
    }
  };

  const valid = () => {
    if (email.trim() === "") {
      enqueueSnackbar("邮箱地址不能空", {
        variant: "error",
      });
      return false;
    } else if (pwd.trim() === "") {
      enqueueSnackbar("密码不能空", {
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const getUserMsg = async () => {
    let url = process.env.REACT_APP_ME_API;

    return await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
        // withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .then((json) => {
        const user = json;
        dispatch(AddUser(user));

        localStorage.setItem("user", JSON.stringify(user));
        console.log(json);
        return user;
      })
      .catch((error) => {
        console.log(error.response);
        enqueueSnackbar("获取用户信息失败", {
          variant: "error",
        });
        return {};
      });
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!valid()) {
      return;
    }

    let url = process.env.REACT_APP_LOGIN_API;
    let form = new FormData();
    form.append("email", email);
    form.append("password", pwd);

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.withCredentials = true;

    // var csrfCookie = Cookies.get("csrftoken");

    const result = await axios
      .post(url, form, {
        headers: {
          "Content-Type": "application/json",
          // "X-CSRFTOKEN": csrfCookie,
        },
        // withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .then((json) => {
        console.log(json.auth_token);
        dispatch(AddToken(json.auth_token));
        localStorage.setItem("token", json.auth_token);
        return true;
      })
      .catch((error) => {
        console.log(error.response);
        enqueueSnackbar("账号或密码错误", {
          variant: "error",
        });
        return false;
      });
    if (result) {
      await getUserMsg();
      history.push("/");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          登录
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="邮箱地址"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="pwd"
            label="密码"
            type="password"
            id="pwd"
            value={pwd}
            autoComplete="current-password"
            onChange={handleChange}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="记住我"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            登录
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                忘记密码？
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"注册管理员账号"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
