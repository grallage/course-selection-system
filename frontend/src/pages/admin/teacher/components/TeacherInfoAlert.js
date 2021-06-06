// https://stackoverflow.com/questions/63737526/material-ui-how-to-open-dialog-imperatively-programmatically
import React from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Card,
  Grid,
} from "@material-ui/core";
import { useDialog } from "../../../../providers/DialogProvider";

function TeacherInfoAlert({ teacher }) {
  const { createDialog, closeDialog } = useDialog();

  const handleSubmit = () => {
    closeDialog();
  };

  return (
    <Card>
      <DialogTitle>教师信息</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>{teacher.user.full_name}教师信息</DialogContentText> */}
        <Grid
          container
          directio="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={teacher.user.full_name}
                label="名称"
                type="text"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={teacher.code}
                label="教师编号"
                type="text"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={teacher.user.email}
                label="邮箱地址"
                type="text"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={
                  teacher.user.sex === "SECRET"
                    ? "未设置"
                    : teacher.user.sex === "MALE"
                    ? "男"
                    : "女"
                }
                label="性别"
                type="text"
                fullWidth
                disabled
              />
            </Grid>

            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={teacher.user.phone}
                label="电话号码"
                type="text"
                fullWidth
                disabled
              />
            </Grid>

            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={teacher.office}
                label="办公室"
                type="text"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                margin="dense"
                value={teacher.user.address}
                label="住址"
                type="text"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                margin="dense"
                value={teacher.domain}
                label="擅长领域"
                type="text"
                fullWidth
                disabled
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      {/* <TextField
        autoFocus
        margin="dense"
        value={teacher.user.full_name}
        label="名称"
        type="text"
        fullWidth
      /> */}
      <DialogActions>
        <Button color="primary" onClick={() => closeDialog()}>
          关闭
        </Button>
      </DialogActions>
    </Card>
  );
}

export default TeacherInfoAlert;
