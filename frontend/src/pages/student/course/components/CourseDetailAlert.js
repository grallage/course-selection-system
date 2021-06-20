import React from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useModal } from "providers/DialogBootstrapProvider";

function CourseDetailAlert({ course }) {
  const { closeModal } = useModal();
  console.log(course);
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>课程详情</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              课程名称：
            </Form.Label>
            <Col sm="9">
              <Form.Control plaintext readOnly defaultValue={course.title} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              教师名称：
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={course.teacher_name}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              是否必修：
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={course.is_compulsory ? "必修" : "选修"}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              课程学分：
            </Form.Label>
            <Col sm="9">
              <Form.Control plaintext readOnly defaultValue={course.credit} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              课程大纲：
            </Form.Label>
            <Col sm="9">
              <Form.Control plaintext readOnly defaultValue={course.outline} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              评分标准：
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={course.evaluation_standard}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              使用书籍：
            </Form.Label>
            <Col sm="9">
              <Form.Control plaintext readOnly defaultValue={course.book} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              平时成绩：
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={course.student_grade1}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              期中成绩：
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={course.student_grade2}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              期末成绩：
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={course.student_grade3}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              总成绩：
            </Form.Label>
            <Col sm="9">
              <Form.Control plaintext readOnly defaultValue={course.grade} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              获得成绩：
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={course.student_credit}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => closeModal()}>
          关闭
        </Button>
      </Modal.Footer>
    </>
  );
}

export default CourseDetailAlert;
