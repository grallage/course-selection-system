import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { SwitchLabel } from "../../major/components/MajorFormElements";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {
  Typography,
  Button,
  TextField,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

import { useFormControls } from "./StudentFormControls";

export default function StudentForm({ type }) {
  let history = useHistory();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const {
    formValues,
    setFormValues,
    errors,
    handleInputValue,

    handleFormSubmit,
    formIsValid,
  } = useFormControls();

  useEffect(() => {
    const init = async () => {
      const classes = await getClasses();
      if (type === "edit") {
        let student = await getStudent();
        setFormValues({
          ...formValues,
          id,
          full_name: student.user.full_name,
          email: student.user.email,
          sex: student.user.sex,
          address: student.user.address,
          phone: student.user.phone,
          is_active: student.user.is_active,
          code: student.code,
          classId: student.class_info.id,
          classes,
          formType: "edit",
        });
      } else {
        const classId = classes[0] ? classes[0].id : -1;
        setFormValues({
          ...formValues,
          classes,
          classId,
        });
      }
    };
    init();
  }, []);

  const handleSubmitAndReturnToListPage = (event) => {
    handleFormSubmit(event).then((result) => {
      if (result) {
        history.push("/student");
      }
    });
  };

  const getClasses = async () => {
    let url = `${process.env.REACT_APP_CLASS_API}`;
    return await axios
      .get(url, {
        params: {
          get_all: true,
          is_active: true,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let msg = "操作失败";
        const response = error.response;
        if (response && response.data && response.data.detail) {
          msg = response.data.detail;
        }
        enqueueSnackbar(msg, {
          variant: "error",
        });
        return [];
      });
  };
  const getStudent = async () => {
    let url = `${process.env.REACT_APP_STUDENT_API}${id}/`;
    return await axios
      .get(url, {
        params: {},
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let msg = "操作失败";
        const response = error.response;
        if (response && response.data && response.data.detail) {
          msg = response.data.detail;
        }
        enqueueSnackbar(msg, {
          variant: "error",
        });
        return [];
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          {type === "create" ? `创建学生` : `编辑学生`}
        </Typography>
      </Grid>

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
        <Grid item sm={6}>
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
      <Grid item sm={12}>
        <FormLabel component="legend">性别</FormLabel>
        <RadioGroup
          row
          aria-label="性别"
          name="sex"
          value={formValues.sex}
          onChange={handleInputValue}
        >
          <FormControlLabel value="FEMALE" control={<Radio />} label="女" />
          <FormControlLabel value="MALE" control={<Radio />} label="男" />
          <FormControlLabel value="SECRET" control={<Radio />} label="秘密" />
        </RadioGroup>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel required>班級</InputLabel>
          <Select
            required
            name="classId"
            value={formValues.classId}
            onChange={handleInputValue}
            label="班級"
            fullWidth
          >
            {formValues.classes.map((row) => (
              <MenuItem value={row.id} key={row.id}>
                {row.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
