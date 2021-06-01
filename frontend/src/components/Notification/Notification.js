import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { Notify, CloseNotify } from "../../redux/actions/NotificationActions";
import { useDispatch, useSelector } from "react-redux";
import { AiFillWarning, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Icon } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// import { SendMsg } from "../../utils/utils";

export default function Notification() {
  //   const classes = useStyles();
  //   const [open, setOpen] = React.useState(false);

  const { msg, type, duration, open } = useSelector(
    (state) => state.notification
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(Notify({ msg: "test", duration: 999999 }));
    // SendMsg("测试");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(CloseNotify());
  };

  const showMsg = () => {
    return (
      <>
        <Typography variant="button" gutterBottom>
          {type === "success" && <AiOutlineCheck />}
          {type === "warning" && <AiFillWarning />}
          {type === "fail" && <AiOutlineClose />} {msg}
        </Typography>
      </>
    );
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClick}>
        测试按钮
      </Button> */}

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        message={showMsg()}
        action={
          <React.Fragment>
            {/* <Button color="secondary" size="small" onClick={handleClose}>
              关闭
            </Button> */}

            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
