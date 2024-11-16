import styles from "./MainModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const MainModal = ({ show, onHide, title, children, okBtn, cancelBtn,modalSize }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={modalSize}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Header closeButton className={`${isArLang?"modal_header_ar":""}`}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles.modal_body} text-center`}>
        {children}
      </Modal.Body>
      {(cancelBtn || okBtn) && (
        <Modal.Footer className={styles.modal_footer}>
          {cancelBtn && (
            <Button
              variant="secondary"
              className={isArLang ? styles.close_btn_ar : styles.close_btn}
              onClick={onHide}
            >
              {cancelBtn}
            </Button>
          )}
          {okBtn && (
            <Button
              variant="primary"
              className={isArLang ? styles.logout_btn_ar : styles.logout_btn}
            >
              {okBtn}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default MainModal;
