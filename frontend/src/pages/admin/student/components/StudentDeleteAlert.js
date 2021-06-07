// https://stackoverflow.com/questions/63737526/material-ui-how-to-open-dialog-imperatively-programmatically
import React from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { useDialog } from "../../../../providers/DialogProvider";

function StudentDeleteAlert({ student, handleDelete }) {
  const { createDialog, closeDialog } = useDialog();

  const handleSubmit = () => {
    handleDelete(student);
    closeDialog();
  };

  return (
    <>
      <DialogTitle>删除学生</DialogTitle>
      <DialogContent>确定要删除{student.name}学生吗？</DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => handleSubmit()}>
          删除
        </Button>
        <Button color="primary" onClick={() => closeDialog()}>
          关闭
        </Button>
      </DialogActions>
    </>
  );
}

export default StudentDeleteAlert;
