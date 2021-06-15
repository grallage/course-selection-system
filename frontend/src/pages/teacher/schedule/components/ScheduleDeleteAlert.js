import React from "react";
import { Modal, Button } from "react-bootstrap";

import { useModal } from "providers/DialogBootstrapProvider";

function ScheduleDeleteAlert({ courseSchedule, handleDelete }) {
  const { closeModal } = useModal();
  const handleSubmit = () => {
    handleDelete(courseSchedule.id);
    closeModal();
  };

  return (
    <>
      {/* <Modal.Dialog> */}
      <Modal.Header closeButton>
        <Modal.Title>删除课程表</Modal.Title>
      </Modal.Header>
      <Modal.Body>确定要删除{courseSchedule.course_name}课程吗？</Modal.Body>
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

export default ScheduleDeleteAlert;
