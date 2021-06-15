import React from "react";
import { Modal } from "react-bootstrap";

const ModalContext = React.createContext();

export const useModal = () => React.useContext(ModalContext);

function ModalContainer(props) {
  const { children, open, onClose, onKill } = props;

  return (
    // <Modal open={open} onClose={onClose} onExited={onKill}>
    <Modal show={open} onHide={onClose} onExited={onKill}>
      {children}
    </Modal>
  );
}

export default function ModalProvider({ children }) {
  const [modals, setModals] = React.useState([]);
  const createModal = (option) => {
    const modal = { ...option, open: true };
    setModals((modals) => [...modals, modal]);
  };
  const closeModal = () => {
    setModals((modals) => {
      const latestModal = modals.pop();
      if (!latestModal) return modals;
      if (latestModal.onClose) latestModal.onClose();
      return [...modals].concat({ ...latestModal, open: false });
    });
  };

  //   const contextValue = React.useRef([createModal, closeModal]);

  return (
    // <ModalContext.Provider value={contextValue.current}>
    <ModalContext.Provider value={{ createModal, closeModal }}>
      {children}
      {modals.map((modal, i) => {
        const { onClose, ...modalParams } = modal;
        const handleKill = () => {
          if (modal.onExited) modal.onExited();
          setModals((modals) => modals.slice(0, modals.length - 1));
        };
        return (
          <ModalContainer
            key={i}
            onClose={closeModal}
            onKill={handleKill}
            {...modalParams}
          />
        );
      })}
    </ModalContext.Provider>
  );
}
