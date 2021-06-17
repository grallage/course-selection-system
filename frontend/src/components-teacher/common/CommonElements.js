import styled from "styled-components/macro";
import { Link as LinkR } from "react-router-dom";
import {
  Container,
  Breadcrumb as BreadcrumbB,
  Card as CardB,
} from "react-bootstrap";

// datepicker
import DatePickerR from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DEFAULT_WIDTH = "250px";

export const Main = styled.main`
  flex-grow: 1;
  min-height: 100vh;
  overflow: hidden;
  margin-top: 56px;
  background-color: #f7f7f7;
  min-height: 50vh;
  padding: 20px;
`;

export const Link = styled(LinkR)`
  text-decoration: none;
  color: inherit;
  &:hover,
  &:focus {
    text-decoration: none;
    color: inherit;
  }
`;

export const Card = styled(CardB)`
  & .card-header {
    background: #fff;
  }
  & .react-datepicker-wrapper {
    display: block;
  }
`;

// https://reactdatepicker.com/
export const DatePicker = styled(DatePickerR)``;

export const SearchContainer = styled(Container)`
  max-width: 100%;
  margin: 20px 0 0 0;
  padding: 0;

  & .col.end {
    display: flex;
    justify-content: flex-end;
  }
`;

export const Breadcrumb = styled(BreadcrumbB)`
  & .breadcrumb {
    background-color: inherit;
  }
`;
