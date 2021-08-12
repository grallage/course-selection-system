import { useEffect } from "react";
import { useSelector } from "react-redux";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Typography, Button, TextField, Grid } from "@material-ui/core";

import { useFormControls } from "./PasswordFormControls";

export default function PasswordForm() {
  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleFormSubmit,
    formIsValid,
  } = useFormControls();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    setFormValues({
      ...formValues,
      id: user.id,
      token,
    });
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          更改密码
        </Typography>
      </Grid>

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

      <Grid item sm={12}>
        <TextField
          margin="dense"
          value={formValues.new_password1}
          name="new_password1"
          onChange={handleInputValue}
          onBlur={handleInputValue}
          label="新密码"
          type="password"
          fullWidth
          {...(errors["new_password1"] && {
            error: true,
            helperText: errors["new_password1"],
          })}
        />
      </Grid>
      <Grid item sm={12}>
        <TextField
          margin="dense"
          value={formValues.new_password2}
          name="new_password2"
          onChange={handleInputValue}
          onBlur={handleInputValue}
          label="确认新密码"
          type="password"
          fullWidth
          {...(errors["new_password2"] && {
            error: true,
            helperText: errors["new_password2"],
          })}
        />
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button onClick={handleFormSubmit} disabled={!formIsValid()}>
            提交
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  );
}
