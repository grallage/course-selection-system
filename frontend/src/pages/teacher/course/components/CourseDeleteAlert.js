import React from "react";
import { Modal, Button } from "react-bootstrap";

import { useModal } from "providers/DialogBootstrapProvider";

function CourseDeleteAlert({ course, handleDelete }) {
  const { closeModal } = useModal();
  const handleSubmit = () => {
    handleDelete(course);
    closeModal();
  };

  return (
    <>
      {/* <Modal.Dialog> */}
      <Modal.Header closeButton>
        <Modal.Title>删除课程</Modal.Title>
      </Modal.Header>
      <Modal.Body>确定要删除{course.title}课程吗？</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => handleSubmit()}>
          删除
        </Button>
        <Button variant="secondary" onClick={() => closeModal()}>
          关闭
        </Button>
      </Modal.Footer>
      {/* </Modal.Dialog> */}
    </>
  );
}

export default CourseDeleteAlert;
