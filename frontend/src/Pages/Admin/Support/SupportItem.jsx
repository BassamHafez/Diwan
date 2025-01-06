import Col from "react-bootstrap/esm/Col";
import styles from "../Admin.module.css";
import { useTranslation } from "react-i18next";
import avatar from "../../../assets/noAvatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import MainModal from "../../../Components/UI/Modals/MainModal";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useCallback, useState } from "react";
import UpdateSupport from "./SupportForm/UpdateSupport";
import { faSquareWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { formatWhatsAppLink } from "../../../Components/Logic/LogicFun";
import { Link } from "react-router-dom";
import useDeleteItem from "../../../hooks/useDeleteItem";

const SupportItem = ({ msgData, refetch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const deleteItem = useDeleteItem();

  const { t: key } = useTranslation();

  const deleteMessage = async () => {
    setShowDeleteModal(false);
    const formData = {
      itemId: msgData?._id,
      endPoint: `support/messages`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    deleteItem(formData);
  };

  const getStatusBgColor = useCallback((status) => {
    switch (status) {
      case "pending":
        return styles.yellow;
      case "processing":
        return styles.blue;
      case "completed":
        return styles.green;
      case "archived":
        return styles.red;
      default:
        return "";
    }
  }, []);

  const whatsappLink = formatWhatsAppLink(msgData?.phone);

  const showDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const hideDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const showUpdateModalHandler = useCallback(() => {
    setShowUpdateModal(true);
  }, []);

  const hideUpdateModalHandler = useCallback(() => {
    setShowUpdateModal(false);
  }, []);

  return (
    <>
      <Col sm={12}>
        <div className={styles.item}>
          <div className="d-flex justify-content-between flex-wrap mb-4">
            <div className={styles.header}>
              <img src={avatar} alt="avatar" />
              <div>
                <h5>{msgData?.name}</h5>
                <span>{msgData?.email}</span>
              </div>
            </div>
            <div>
              <span
                className={`${styles.status_badge} ${getStatusBgColor(
                  msgData?.status
                )}`}
              >
                {key(msgData?.status)}
              </span>
            </div>
          </div>
          <div className="text-center mb-1">
            <h5 className="m-0">{msgData?.subject}</h5>
            <FontAwesomeIcon className="color-main" icon={faCaretDown} />
          </div>

          <div className={styles.message_div}>
            <p className="m-0">{msgData.message}</p>
            <div className="d-flex justify-content-end align-items-center mt-2">
              {msgData?.phone && (
                <>
                  <Link
                    className={styles.support_links}
                    target="_blank"
                    to={whatsappLink}
                    rel="noopener noreferrer"
                    title={key("whatsapp")}
                  >
                    <FontAwesomeIcon icon={faSquareWhatsapp} />
                  </Link>
                </>
              )}
              <Link
                className={styles.support_links}
                target="_blank"
                to={`mailto:${msgData?.email}`}
                title={key("email")}
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </Link>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center position-relative flex-wrap px-1 mt-4">
            <ButtonOne
              text={key("delete")}
              classes="bg-danger"
              borderd={true}
              onClick={showDeleteModalHandler}
            />
            <ButtonOne
              onClick={showUpdateModalHandler}
              text={key("update")}
              borderd={true}
            />
          </div>
        </div>
      </Col>

      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={hideDeleteModalHandler}
          confirmFun={deleteMessage}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}

      {showUpdateModal && (
        <ModalForm
          show={showUpdateModal}
          onHide={hideUpdateModalHandler}
          modalSize="md"
        >
          <UpdateSupport
            refetch={refetch}
            hideModal={hideUpdateModalHandler}
            msgStatus={msgData?.status}
            msgId={msgData?._id}
          />
        </ModalForm>
      )}
    </>
  );
};

export default SupportItem;
