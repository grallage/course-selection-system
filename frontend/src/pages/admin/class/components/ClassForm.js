import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import { useFormControls } from "./ClassFormControls";

export default function ClassForm() {
  let history = useHistory();
  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,
    handleDateValue,
    handleFormSubmit,
    formIsValid,
  } = useFormControls();

  useEffect(async () => {
    const majors = await getMajors();
    const majorId = majors[0] ? majors[0].id : -1;
    setFormValues({
      ...formValues,
      majors,
      majorId,
    });
  }, []);

  const handleSubmitAndReturnToListPage = (event) => {
    handleFormSubmit(event).then((result) => {
      if (result) {
        history.push("/class");
      }
    });
  };

  const getMajors = async () => {
    let url = `${process.env.REACT_APP_MAJOR_API}`;
    return await axios
      .get(url, {
        params: {
          get_all: true,
          is_active: true,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("錯誤");
        console.log(error.response);
        return [];
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          创建班级
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          required
          name="classCount"
          label="班级个数"
          fullWidth
          variant="outlined"
          value={formValues.classCount}
          onChange={handleInputValue}
          onBlur={handleInputValue}
          type="number"
          placeholder="每届每个专业班级最多为10个"
          autoFocus
          // error={classCountError !== ""}
          // helperText={classCountError}
          {...(errors["classCount"] && {
            error: true,
            helperText: errors["classCount"],
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl variant="outlined" fullWidth>
          {/* <FormControl fullWidth> */}
          <InputLabel required>专业</InputLabel>
          <Select
            required
            name="majorId"
            value={formValues.majorId}
            onChange={handleInputValue}
            label="专业"
            fullWidth
          >
            {formValues.majors.map((row) => (
              <MenuItem value={row.id} key={row.id}>
                {row.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl variant="outlined" fullWidth>
          {/* <FormControl fullWidth> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              margin="normal"
              label="班级创立时间"
              format="yyyy"
              fullWidth
              name="year"
              views={["year"]}
              value={formValues.year}
              onChange={handleDateValue}
              okLabel="确定"
              clearLabel="清除"
              cancelLabel="取消"
              minDate={new Date().setFullYear(new Date().getFullYear() - 10)}
              maxDate={new Date()}
              inputVariant="outlined"
              style={{ margin: 0 }}
              required
            />
          </MuiPickersUtilsProvider>
        </FormControl>
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
