import styled from "styled-components/macro";
import { AiOutlinePlus, AiFillDelete } from "react-icons/ai";
import { Table, Form } from "react-bootstrap";

export const ScheduleContainer = styled(Table)`
  /* width: 100%; */
  & td,
  & th {
    border: 1px solid #dee2e6;
  }
`;
export const ScheduleThead = styled.thead``;

export const ScheduleTh = styled.th`
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
  font-size: 1.2rem;
  width: 12.5%;
`;

export const ScheduleTr = styled.tr`
  &.bg-light-gray {
    background-color: #f7f7f7;
  }
`;

export const ScheduleBody = styled.tbody``;

export const ScheduleTd = styled.td`
  font-weight: bold;
  /* position: relative; */
  height: 1px;
`;

export const ScheduleTdWrapper = styled.div`
  flex: 1;
  /* display: flex; */
  display: inline-flex;
  flex-direction: column;
  align-content: space-between;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
`;

export const ClassNameText = styled.span`
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px 15px 5px;
  background-color: #ff48a4;
  box-sizing: border-box;
  color: white;
  font-weight: bolder;
  &.other-course {
    opacity: 0.4;
  }
`;

export const ClassNameSubText = styled.span`
  margin-bottom: 15px;
  color: black;
`;

const _Btn = styled.button`
  border: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 1.4rem;
`;

export const AddBtn = styled(({ children, ...props }) => (
  <_Btn {...props}>
    <AiOutlinePlus />
    {children}
  </_Btn>
))`
  color: #5bbd2a;
  background-color: inherit;
  opacity: 0.8;
`;

export const DelBtn = styled(({ children, ...props }) => (
  <_Btn {...props}>
    <AiFillDelete />
    {children}
  </_Btn>
))`
  margin-top: auto;
  flex: 0 0 15px;
`;

export const SwitchLabel = styled(Form.Label)`
  font-size: 1.2rem;
  margin: 0;
  margin-right: 10px;
  padding: 0;
`;
