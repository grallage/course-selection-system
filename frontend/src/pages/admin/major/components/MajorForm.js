import axios from "axios";
import { useEffect } from "react";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { useHistory, useParams } from "react-router-dom";
import { ButtonGroup } from "@material-ui/core";
import { SwitchLabel } from "./MajorFormElements";

import { useFormControls } from "./MajorFormControls";

export default function MajorForm({ type }) {
  let history = useHistory();
  const { id } = useParams();
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
      // console.log("编辑");
      let { name, description, is_active } = await getMajor();
      setFormValues({
        ...formValues,
        formType: "edit",
        id,
        name,
        description,
        is_active,
      });
    }
  }, []);

  const handleSubmitAndReturnToListPage = (event) => {
    handleFormSubmit(event).then((result) => {
      if (result) {
        // console.log("result:");
        // console.log(result);
        history.push("/major");
      }
    });
  };

  const getMajor = async () => {
    let url = `${process.env.REACT_APP_MAJOR_API}${id}/`;
    return await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        // console.log(json);
        return {
          name: json.name,
          description: json.description,
          is_active: json.is_active,
        };
      })
      .catch((error) => {
        console.log("錯誤");
        // console.log(error);
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
      {/* </Grid> */}
      {/* </form> */}
    </>
  );
}
