import noAvatar from "../../../assets/default.png";
import styles from "./Contacts.module.css";
import {
  formatPhoneNumber,
  formatWhatsAppLink,
  renameContactTypeAr,
  renameContactTypeEn,
} from "../../../Components/Logic/LogicFun";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquarePhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Col from "react-bootstrap/esm/Col";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { mainDeleteFunHandler } from "../../../util/Http";

const ContactItem = ({ contact, type, showNotes, isListView,refetch }) => {
  const [renamedType, setRenamedType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = useSelector((state) => state.userInfo.token);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const formattedPhone = formatPhoneNumber(contact.phone);
  const formattedPhone2 = contact.phone2
    ? formatPhoneNumber(contact.phone2)
    : null;
  const whatsappLink = formatWhatsAppLink(contact.phone);
  const whatsappLink2 = contact.phone2
    ? formatWhatsAppLink(contact.phone2)
    : null;

  useEffect(() => {
    let renamedTypeVal;
    if (!isArLang) {
      renamedTypeVal = renameContactTypeEn(type);
    } else {
      renamedTypeVal = renameContactTypeAr(type);
    }

    setRenamedType(renamedTypeVal);
  }, [renamedType, isArLang, type]);

  const deleteContact = async () => {
    setShowDeleteModal(false);
    if (contact._id && token) {
      const res = await mainDeleteFunHandler({
        id: contact._id,
        token: token,
        type: `contacts/${type}s`,
      });
      if (res.status === 204) { 
        refetch()
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };
  const gridXXLSystem=isListView?12:4;
  const gridLgSystem=isListView?12:6;

  return (
    <>
      <Col lg={gridLgSystem} xxl={gridXXLSystem}>
        <div className={styles.contact_item}>
          <div className={styles.contact_header}>
            <div className={styles.img_side}>
              <img className={styles.noAvatar} src={noAvatar} alt="avatar" />
              <div
                className={`${styles.name_div} ${isArLang ? "me-2" : "ms-2"}`}
              >
                <h6>{contact.name}</h6>
                <span>{renamedType || type}</span>
              </div>
            </div>
            <div className={`${styles.controller_icons} ${isArLang?styles.controller_icons_ar:styles.controller_icons_en}`}>
              <FontAwesomeIcon
                title={key("delete")}
                className="text-danger"
                icon={faTrash}
                onClick={() => setShowDeleteModal(true)}
              />
              <FontAwesomeIcon title={key("ediet")} icon={faPenToSquare} />
            </div>
          </div>
          <hr />
          <div>
            <h6 className="text-secondary">{key("phoneNum")}</h6>
            <div className="d-flex align-items-center flex-wrap">
              <span
                className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}
              >
                {contact.phone}
              </span>
              <div className={styles.contacts_icons}>
                <a
                  href={`tel:${formattedPhone}`}
                  className={styles.contact_icon}
                >
                  <FontAwesomeIcon icon={faSquarePhone} />
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contact_icon} ${styles.whatsappLink}`}
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </div>
            </div>

            {contact.phone2 && (
              <div className="d-flex align-items-center flex-wrap">
                <span
                  className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}
                >
                  {contact.phone2}
                </span>
                <div className={styles.contacts_icons}>
                  <a
                    href={`tel:${formattedPhone2}`}
                    className={styles.contact_icon}
                  >
                    <FontAwesomeIcon icon={faSquarePhone} />
                  </a>
                  <a
                    href={whatsappLink2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.contact_icon} ${styles.whatsappLink}`}
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                </div>
              </div>
            )}

            {contact.notes&&showNotes&&<div>
              {contact.notes}
            </div>}
          </div>
        </div>
      </Col>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteContact}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
    </>
  );
};

export default ContactItem;
