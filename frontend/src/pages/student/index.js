import React from "react";
import { Card } from "../../components-teacher/common/CommonElements";
import { Button } from "react-bootstrap";
const index = () => {
  return (
    <Card>
      <Card.Header>学生管理首页</Card.Header>
      <Card.Body>
        <Card.Title>Special title treatment</Card.Title>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
};

export default index;
