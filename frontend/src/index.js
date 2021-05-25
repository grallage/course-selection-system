import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ThemeProvider } from "styled-components";
import { MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

// redux
import { Provider } from "react-redux";
import store from "./store";

const theme = createMuiTheme();

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      {/* //Use the theme in the ThemeProvider for Material-UI so //styles are
      applied to the Material-UI components */}
      <MuiThemeProvider theme={theme}>
        {/* //Use also the ThemeProvider for Styled-Components so //you can access
        the theme in your own css */}
        <ThemeProvider theme={theme}>
          {/* //Include your app and you have acces to everything */}
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
