import noAvatar from "../../../assets/default.png";
import organizationImage from "../../../assets/organization.png";
import noAvatarGray from "../../../assets/noAvatar.png";
import styles from "./Contacts.module.css";
import {
  formatPhoneNumber,
  formatWhatsAppLink,
  renameContactType,
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
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import UpdateContactForm from "./ContactForms/UpdateContactForm";
import AOS from "aos";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";

const ContactItem = ({
  contact,
  type,
  showNotes,
  isListView,
  refetch,
  refetchAllContacts,
  showTenantDetials,
}) => {
  const [renamedType, setRenamedType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateContactModal, setShowUpdateContactModal] = useState(false);

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
    AOS.init({disable: 'mobile'});;
  }, []);

  useEffect(() => {
    const myType = type === "contact" ? contact.contactType : type;
    const language = isArLang ? "ar" : "en";

    setRenamedType(renameContactType(myType, language));
  }, [isArLang, type, contact]);

  const deleteContact = async () => {
    setShowDeleteModal(false);
    const myType = type === "contact" ? contact.contactType : type;
    if (contact._id && token) {
      const res = await mainDeleteFunHandler({
        id: contact._id,
        token: token,
        type: `contacts/${myType}s`,
      });
      if (res.status === 204) {
        if (refetch) {
          refetch();
        }
        refetchAllContacts();
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const gridXXLSystem = isListView ? 12 : 4;
  const gridLgSystem = isListView ? 12 : 6;

  return (
    <>
      <Col lg={gridLgSystem} xxl={gridXXLSystem}>
        <div
          className={styles.contact_item}
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          <div className={styles.contact_header}>
            <div className={styles.img_side}>
              <img
                className={styles.noAvatar}
                src={
                  type === "tenant"
                    ? contact.type === "organization"
                      ? organizationImage
                      : noAvatarGray
                    : noAvatar
                }
                alt="avatar"
              />
              <div
                className={`${styles.name_div} ${isArLang ? "me-2" : "ms-2"}`}
              >
                <h6>{contact.name}</h6>
                <span>
                  {(contact.address ? contact.address : renamedType) || type}
                </span>
              </div>
            </div>
            <div
              className={`${styles.controller_icons} ${
                isArLang
                  ? styles.controller_icons_ar
                  : styles.controller_icons_en
              }`}
            >
              <CheckPermissions btnActions={["DELETE_CONTACT"]}>
                <FontAwesomeIcon
                  title={key("delete")}
                  className="text-danger"
                  icon={faTrash}
                  onClick={() => setShowDeleteModal(true)}
                />
              </CheckPermissions>
              <CheckPermissions btnActions={["UPDATE_CONTACT"]}>
                <FontAwesomeIcon
                  onClick={() => setShowUpdateContactModal(true)}
                  title={key("ediet")}
                  icon={faPenToSquare}
                />
              </CheckPermissions>
            </div>
          </div>
          <hr />
          <div className={styles.phones_div}>
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
          </div>
          {type === "tenant" && showTenantDetials && (
            <>
              {contact.nationalId && (
                <div>
                  <h6 className="text-secondary">{key("nationalId")}</h6>
                  <span
                    className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}
                  >
                    {contact.nationalId}
                  </span>
                </div>
              )}
              {contact.taxNumber && (
                <div>
                  <h6 className="text-secondary">{key("taxNumber")}</h6>
                  <span
                    className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}
                  >
                    {contact.taxNumber}
                  </span>
                </div>
              )}
              {contact.commercialRecord && (
                <div className="mt-2">
                  <h6 className="text-secondary">{key("commercialRecord")}</h6>
                  <span
                    className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}
                  >
                    {contact.commercialRecord}
                  </span>
                </div>
              )}
            </>
          )}
          {showNotes && type !== "tenant" && (
            <div className={styles.note}>
              <p>{contact.notes ? contact.notes : key("noNotes")}</p>
            </div>
          )}
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

      {showUpdateContactModal && (
        <ModalForm
          show={showUpdateContactModal}
          onHide={() => setShowUpdateContactModal(false)}
          modalSize="lg"
        >
          <UpdateContactForm
            hideModal={() => setShowUpdateContactModal(false)}
            contactType={type === "contact" ? contact.contactType : type}
            refetch={refetch}
            refetchAllContacts={refetchAllContacts}
            contact={contact}
          />
        </ModalForm>
      )}
    </>
  );
};

export default ContactItem;
