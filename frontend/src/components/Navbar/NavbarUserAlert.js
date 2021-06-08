// https://stackoverflow.com/questions/63737526/material-ui-how-to-open-dialog-imperatively-programmatically
import React from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  Grid,
} from "@material-ui/core";
import { useDialog } from "../../providers/DialogProvider";
import { useSelector } from "react-redux";

function NavbarUserInfoAlert() {
  const { closeDialog } = useDialog();
  const user = useSelector((state) => state.user.user);

  return (
    <Card>
      <DialogTitle>用户信息</DialogTitle>
      <DialogContent>
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
                value={user.full_name}
                label="名称"
                type="text"
                fullWidth
                disabled
              />
            </Grid>

            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={user.email}
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
                  user.sex === "SECRET"
                    ? "未设置"
                    : user.sex === "MALE"
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
                value={user.phone}
                label="电话号码"
                type="text"
                fullWidth
                disabled
              />
            </Grid>

            <Grid item sm={12}>
              <TextField
                margin="dense"
                value={user.address}
                label="住址"
                type="text"
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={() => closeDialog()}>
          关闭
        </Button>
      </DialogActions>
    </Card>
  );
}

export default NavbarUserInfoAlert;
