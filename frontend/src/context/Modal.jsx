import { useState, useRef, createContext, useContext } from "react";
import { ReactDOM } from "react-dom/client";
import "./Modal.css";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null); //clear modal content
    if (typeof onModalClose === "function") {
      //if the cb func is truthy, call the cb func and reset to null
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef, // references Modal Div
    modalContent, // React component to render inside the modal
    setModalContent, // function to set the react component to render inside modal
    setModalContent, // function to set the cb func to be called when modal is closing
    closeModal, // function to close the modal
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  if (!modalRef || !modalRef.current || !modalContent) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal}>
        <div id="modal-content">{modalContent}</div>
      </div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
