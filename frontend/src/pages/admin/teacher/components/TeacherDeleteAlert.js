// https://stackoverflow.com/questions/63737526/material-ui-how-to-open-dialog-imperatively-programmatically
import React from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { useDialog } from "../../../../providers/DialogProvider";

function TeacherDeleteAlert({ teacher, handleDelete }) {
  const { createDialog, closeDialog } = useDialog();

  const handleSubmit = () => {
    handleDelete(teacher);
    closeDialog();
  };

  return (
    <>
      <DialogTitle>删除教师</DialogTitle>
      <DialogContent>确定要删除{teacher.name}教师吗？</DialogContent>
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

export default TeacherDeleteAlert;
