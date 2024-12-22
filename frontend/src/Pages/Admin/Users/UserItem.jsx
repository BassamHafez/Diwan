import styles from "../Admin.module.css";
import noAvatar from "../../../assets/default.png";
import { useTranslation } from "react-i18next";
import Col from "react-bootstrap/esm/Col";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faSquarePhone } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { mainDeleteFunHandler } from "../../../util/Http";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserItem = ({ userData, refetch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const deletePack = async () => {
    setShowDeleteModal(false);
    if (userData._id && token) {
      const res = await mainDeleteFunHandler({
        id: userData._id,
        token: token,
        type: `users`,
      });
      if (res.status === 204) {
        if (refetch) {
          refetch();
        }
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  return (
    <>
      <Col lg={4} md={6}>
        <div className={`${styles.item} pb-3`}>
          <div className={styles.header}>
            <img
              src={
                userData.photo
                  ? `${import.meta.env.VITE_Host}${userData.photo}`
                  : noAvatar
              }
              alt="noAvatar"
            />
            <div>
              <h5>
                {userData.name}
                {userData.isKing && (
                  <FontAwesomeIcon
                    className="text-warning mx-1"
                    icon={faCrown}
                  />
                )}
              </h5>
              <span style={{ wordBreak: "break-all" }}>{userData.email}</span>
            </div>
          </div>
          <div className="mt-4 px-2">
            <div className={styles.info}>
              <span>{key("phone")} :</span>
              {/* <p className={isArLang?"me-3":"ms-3"}>{userData.phone}</p> */}
              <div className="d-flex align-items-center flex-wrap">
                <p className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}>
                  {userData.phone}
                </p>
                <div className={styles.contacts_icons}>
                  <a
                    href={`tel:${userData.phone}`}
                    className={styles.contact_icon}
                    title={key("call")}
                  >
                    <FontAwesomeIcon icon={faSquarePhone} />
                  </a>
                </div>
              </div>
            </div>

            {userData._id !== profileInfo._id ? (
              !userData.isKing && (
                <div
                  className={`${styles.controller_div} d-flex justify-content-end align-items-center position-relative mt-3`}
                >
                  <ButtonOne
                    text={key("delete")}
                    classes="bg-danger"
                    borderd={true}
                    onClick={() => setShowDeleteModal(true)}
                  />
                </div>
              )
            ) : (
              <div
                className={`${styles.controller_div} d-flex justify-content-end align-items-center position-relative mt-3`}
              >
                <ButtonOne
                  text={key("ediet")}
                  classes="bg-navy"
                  borderd={true}
                  onClick={() => navigate("/admin-settings")}
                />
              </div>
            )}
          </div>
        </div>
      </Col>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deletePack}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
    </>
  );
};

export default UserItem;
