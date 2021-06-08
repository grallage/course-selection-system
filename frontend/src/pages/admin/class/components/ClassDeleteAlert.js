// https://stackoverflow.com/questions/63737526/material-ui-how-to-open-dialog-imperatively-programmatically
import React from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { useDialog } from "providers/DialogProvider";

function ClassDeleteAlert({ classInfo, handleDelete }) {
  const { createDialog, closeDialog } = useDialog();

  const handleSubmit = () => {
    handleDelete(classInfo);
    closeDialog();
  };

  return (
    <>
      <DialogTitle>删除班级</DialogTitle>
      <DialogContent>确定要删除{classInfo.name}班级吗？</DialogContent>
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

export default ClassDeleteAlert;
