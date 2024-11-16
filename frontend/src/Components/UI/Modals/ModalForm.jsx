import styles from "./MainModal.module.css";
import Modal from "react-bootstrap/Modal";

const ModalForm = ({show, onHide, children}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        {children}
      </Modal.Body>
    </Modal>
  )
}

export default ModalForm
