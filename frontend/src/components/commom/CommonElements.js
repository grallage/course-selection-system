import styled from "styled-components/macro";

import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link as LinkR } from "react-router-dom";

export const Main = styled.main`
  flex-grow: 1;
  height: 100vh;
  overflow: hidden;
`;

export const PageContainer = styled(Container)`
  padding-top: 32px;
`;

export const MainSearchForm = styled.form`
  display: flex;
  justify-content: space-between;
  & .MuiTextField-root {
    margin-right: 8px;
    /* flex-shrink: 1; */
    width: 100%;
    /* display: flex;
    flex-shrink: 1; */
  }
`;

export const TableWapper = styled(Table)`
  min-width: 650px;
`;

export const GridContainer = styled(({ children, ...props }) => (
  <Grid container spacing={3} {...props}>
    {children}
  </Grid>
))``;

export const CommonLink = styled(LinkR)`
  color: inherit;
  text-decoration: none;
  /* display: inherit; */
  align-items: inherit;
  justify-content: inherit;
`;

export const MainContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  width: 100%;
`;

export const LinkWrapper = styled(Button)`
  padding: 0;
  margin: 0;
`;
