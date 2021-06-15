import React from "react";
import Dialog from "@material-ui/core/Dialog";

const DialogContext = React.createContext();

export const useDialog = () => React.useContext(DialogContext);

function DialogContainer(props) {
  const { children, open, onClose, onKill } = props;

  return (
    <Dialog open={open} onClose={onClose} onExited={onKill}>
      {children}
    </Dialog>
  );
}

export default function DialogProvider({ children }) {
  const [dialogs, setDialogs] = React.useState([]);
  const createDialog = (option) => {
    const dialog = { ...option, open: true };
    setDialogs((dialogs) => [...dialogs, dialog]);
  };
  const closeDialog = () => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.pop();
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      return [...dialogs].concat({ ...latestDialog, open: false });
    });
  };

  //   const contextValue = React.useRef([createDialog, closeDialog]);

  return (
    // <DialogContext.Provider value={contextValue.current}>
    <DialogContext.Provider value={{ createDialog, closeDialog }}>
      {children}
      {dialogs.map((dialog, i) => {
        const { onClose, ...dialogParams } = dialog;
        const handleKill = () => {
          if (dialog.onExited) dialog.onExited();
          setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
        };
        return (
          <DialogContainer
            key={i}
            onClose={closeDialog}
            onKill={handleKill}
            {...dialogParams}
          />
        );
      })}
    </DialogContext.Provider>
  );
}
