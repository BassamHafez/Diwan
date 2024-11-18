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

const ContactItem = ({ contact }) => {
  const [renamedType, setRenamedType] = useState("");

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

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
      renamedTypeVal = renameContactTypeEn(contact?.type);
    } else {
      renamedTypeVal = renameContactTypeAr(contact?.type);
    }

    setRenamedType(renamedTypeVal);
  }, [renamedType, isArLang, contact]);

  return (
    <Col sm={6} lg={4}>
      <div className={styles.contact_item}>
        <div className={styles.contact_header}>
          <div className={styles.img_side}>
            <img className={styles.noAvatar} src={noAvatar} alt="avatar" />
            <div className={`${styles.name_div} ${isArLang ? "me-2" : "ms-2"}`}>
              <h6>{contact.name}</h6>
              <span>{renamedType || contact?.type}</span>
            </div>
          </div>
          <div className={styles.controller_icons}>
            <FontAwesomeIcon
              title={key("delete")}
              className="text-danger"
              icon={faTrash}
            />
            <FontAwesomeIcon title={key("ediet")} icon={faPenToSquare} />
          </div>
        </div>
        <hr />
        <div>
          <h6 className="text-secondary">{key("phoneNum")}</h6>
          <div className="d-flex align-items-center flex-wrap">
            <span className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}>
              {contact.phone}
            </span>
            <div className={styles.contacts_icons}>
              <a href={`tel:${formattedPhone}`} className={styles.contact_icon}>
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
      </div>
    </Col>
  );
};

export default ContactItem;
