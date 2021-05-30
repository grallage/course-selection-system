import Cookies from "js-cookie";
import axios from "axios";

import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
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
  let history = useHistory();

  const token = useSelector((state) => state.user.token);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const handleChange = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
    if (event.target.name === "pwd") {
      setPwd(event.target.value);
    }
  };

  const getUserMsg = () => {
    let url = process.env.REACT_APP_ME_API;
    console.log("!!token");
    console.log(token);
    axios
      .get(
        url,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
          // withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .then((json) => {
        const user = json;
        dispatch(AddUser(user));
        localStorage.setItem("user", JSON.stringify(user));
        console.log(json);
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error.response.status);
        console.log("账号或密码错误");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("登录！");

    let url = process.env.REACT_APP_LOGIN_API;
    url = "http://localhost:8000/auth/token/login/";

    let form = new FormData();
    form.append("email", email);
    form.append("password", pwd);

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.withCredentials = true;

    var csrfCookie = Cookies.get("csrftoken");
    // console.log(csrfCookie);

    axios
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
        const token = json.auth_token;
        dispatch(AddToken(token));
        localStorage.setItem("token", token);

        getUserMsg();
        console.log(token);
        history.push("/");
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error.response.status);
        console.log("账号或密码错误");
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
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
            label="Password"
            type="password"
            id="pwd"
            value={pwd}
            autoComplete="current-password"
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
