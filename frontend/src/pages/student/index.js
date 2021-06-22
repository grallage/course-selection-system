import React from "react";
import { Card } from "../../components-teacher/common/CommonElements";
import { Button } from "react-bootstrap";
const index = () => {
  return (
    <Card>
      <Card.Header>学生管理首页</Card.Header>
      <Card.Body>
        <Card.Title>学生管理首页</Card.Title>
        <Card.Text>学生管理首页...</Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
};

export default index;
