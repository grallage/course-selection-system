// https://stackoverflow.com/questions/63737526/material-ui-how-to-open-dialog-imperatively-programmatically
import React, { useEffect } from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
} from "@material-ui/core";
import { useDialog } from "../../../../providers/DialogProvider";
import { useFormControls } from "./TeacherFormControls";
import { SwitchLabel } from "../../major/components/MajorFormElements";

function TeacherEditAlert({ teacher, type, getTeacherList }) {
  const { closeDialog } = useDialog();
  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleFormSubmit,
    formIsValid,
  } = useFormControls({ closeDialog, getTeacherList });

  useEffect(() => {
    if (type === "edit") {
      let { id, full_name, email, sex, address, phone, is_active } =
        teacher.user;
      let { domain, office, code } = teacher;

      setFormValues({
        ...formValues,
        formType: "edit",
        id,
        full_name,
        email,
        sex,
        address,
        phone,
        is_active,
        domain,
        office,
        code,
      });
    }
  }, []);

  return (
    <Card>
      <DialogTitle>{type === "create" ? `创建教师` : `编辑教师`}</DialogTitle>
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
                value={formValues.full_name}
                name="full_name"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                label="名称"
                type="text"
                fullWidth
                {...(errors["full_name"] && {
                  error: true,
                  helperText: errors["full_name"],
                })}
              />
            </Grid>
            {/* <Grid item sm={6}>
              <TextField
                margin="dense"
                name="code"
                value={teacher.code}
                label="教师编号"
                type="text"
                fullWidth
                disabled
              />
            </Grid> */}

            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={formValues.email}
                name="email"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                label="邮箱地址"
                type="email"
                fullWidth
                {...(errors["email"] && {
                  error: true,
                  helperText: errors["email"],
                })}
              />
            </Grid>
            {type === "create" && (
              <Grid item sm={12}>
                <TextField
                  margin="dense"
                  value={formValues.password}
                  name="password"
                  onChange={handleInputValue}
                  onBlur={handleInputValue}
                  label="密码"
                  type="password"
                  fullWidth
                  {...(errors["password"] && {
                    error: true,
                    helperText: errors["password"],
                  })}
                />
              </Grid>
            )}
            <Grid item sm={12}>
              <FormLabel component="legend">性别</FormLabel>
              <RadioGroup
                row
                aria-label="性别"
                name="sex"
                value={formValues.sex}
                onChange={handleInputValue}
              >
                <FormControlLabel
                  value="FEMALE"
                  control={<Radio />}
                  label="女"
                />
                <FormControlLabel value="MALE" control={<Radio />} label="男" />
                <FormControlLabel
                  value="SECRET"
                  control={<Radio />}
                  label="秘密"
                />
              </RadioGroup>
            </Grid>

            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={formValues.phone}
                name="phone"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                label="电话号码"
                type="text"
                fullWidth
                {...(errors["phone"] && {
                  error: true,
                  helperText: errors["phone"],
                })}
              />
            </Grid>

            <Grid item sm={6}>
              <TextField
                margin="dense"
                value={formValues.office}
                name="office"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                label="办公室"
                type="text"
                fullWidth
                {...(errors["office"] && {
                  error: true,
                  helperText: errors["office"],
                })}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                margin="dense"
                value={formValues.address}
                name="address"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                label="住址"
                type="text"
                fullWidth
                {...(errors["address"] && {
                  error: true,
                  helperText: errors["address"],
                })}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                margin="dense"
                value={formValues.domain}
                name="domain"
                onChange={handleInputValue}
                onBlur={handleInputValue}
                label="擅长领域"
                type="text"
                fullWidth
                multiline
                rows={2}
                {...(errors["domain"] && {
                  error: true,
                  helperText: errors["domain"],
                })}
              />
            </Grid>
            <Grid item sm={12}>
              <SwitchLabel
                control={
                  <Switch
                    checked={formValues.is_active}
                    onChange={handleInputValue}
                    name="is_active"
                    required
                  />
                }
                labelPlacement="start"
                label="是否激活"
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={handleFormSubmit}
          disabled={!formIsValid()}
        >
          保存
        </Button>
        <Button color="primary" onClick={() => closeDialog()}>
          关闭
        </Button>
      </DialogActions>
    </Card>
  );
}

export default TeacherEditAlert;
