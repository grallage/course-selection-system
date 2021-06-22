import React from "react";
import { Main, Card } from "../../components-teacher/common/CommonElements";
import { Button } from "react-bootstrap";
const index = () => {
  return (
    <Main>
      <Card>
        <Card.Header>教师管理首页</Card.Header>
        <Card.Body>
          <Card.Title>教师管理首页</Card.Title>
          <Card.Text>教师管理首页...</Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </Main>
  );
};

export default index;
