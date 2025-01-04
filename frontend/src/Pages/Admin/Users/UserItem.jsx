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

const UserItem = ({
  userData,
  refetch,
  selectUserHandler,
  selectedUsers,
  isAdminPage,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const isIdExist = selectedUsers?.find((id) => id === userData?._id);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const deletePack = async () => {
    setShowDeleteModal(false);
    if (userData?._id && token) {
      const res = await mainDeleteFunHandler({
        id: userData?._id,
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

  const selectHandler = () => {
    selectUserHandler(userData?._id);
  };
  return (
    <>
      <Col lg={4} md={6}>
        <div
          className={`${styles.item} ${
            isIdExist !== undefined && isIdExist
              ? styles.borderd_item
              : styles.transparent_border
          } pb-3`}
        >
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

            {userData?._id !== profileInfo?._id ? (
              !userData.isKing && (
                <div
                  className={`${
                    styles.controller_div
                  } d-flex align-items-center flex-wrap position-relative mt-3 ${
                    isAdminPage
                      ? "justify-content-end"
                      : "justify-content-between"
                  }`}
                >
                  <ButtonOne
                    text={key("delete")}
                    classes="bg-danger m-2"
                    borderd={true}
                    onClick={() => setShowDeleteModal(true)}
                  />

                  {!isAdminPage && (
                    <ButtonOne
                      text={!isIdExist ? key("select") : key("exclude")}
                      classes="bg-navy m-2"
                      borderd={true}
                      onClick={selectHandler}
                    />
                  )}
                </div>
              )
            ) : (
              <div
                className={`${styles.controller_div} d-flex justify-content-end align-items-center position-relative mt-3`}
              >
                <ButtonOne
                  text={key("ediet")}
                  classes="bg-navy m-2"
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
