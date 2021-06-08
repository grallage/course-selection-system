import { useEffect } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import { useSelector } from "react-redux";
import { SwitchLabel } from "./MajorFormElements";
import { useFormControls } from "./MajorFormControls";

export default function MajorForm({ type }) {
  const history = useHistory();
  const { id } = useParams();
  const token = useSelector((state) => state.user.token);
  const { enqueueSnackbar } = useSnackbar();

  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleFormSubmit,
    formIsValid,
  } = useFormControls();

  useEffect(async () => {
    if (type === "edit") {
      let { name, description, is_active } = await getMajor();
      setFormValues({
        ...formValues,
        formType: "edit",
        id,
        name,
        description,
        is_active,
        token,
      });
    } else {
      setFormValues({
        ...formValues,
        token,
      });
    }
  }, []);

  const handleSubmitAndReturnToListPage = (event) => {
    handleFormSubmit(event).then((result) => {
      if (result) {
        history.push("/major");
      }
    });
  };

  const getMajor = async () => {
    let url = `${process.env.REACT_APP_MAJOR_API}${id}/`;
    return await axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        return {
          name: json.name,
          description: json.description,
          is_active: json.is_active,
        };
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.data && response.data.detail) {
          enqueueSnackbar(response.data.detail, {
            variant: "error",
          });
        }
        return { name: "", description: "", is_active: false };
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          创建专业
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          required
          name="name"
          label="专业名称"
          fullWidth
          variant="outlined"
          value={formValues.name}
          onChange={handleInputValue}
          onBlur={handleInputValue}
          autoComplete="none"
          inputProps={{
            maxLength: 32,
          }}
          // error={errors["name"] !== ""}
          // helperText={errors["name"]}
          {...(errors["name"] && {
            error: true,
            helperText: errors["name"],
          })}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="description"
          label="专业描述"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={formValues.description}
          onChange={handleInputValue}
          onBlur={handleInputValue}
          autoComplete="none"
        />
      </Grid>
      <Grid item xs={12}>
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

      <Grid item xs={12}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button onClick={handleFormSubmit} disabled={!formIsValid()}>
            提交
          </Button>
          <Button
            onClick={handleSubmitAndReturnToListPage}
            disabled={!formIsValid()}
          >
            提交並返回列表頁
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  );
}
