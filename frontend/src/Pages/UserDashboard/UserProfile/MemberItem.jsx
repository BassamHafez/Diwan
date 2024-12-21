import styles from "./UserProfile.module.css";
import avatar from "../../../assets/default.png";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import MainModal from "../../../Components/UI/Modals/MainModal";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { mainDeleteFunHandler } from "../../../util/Http";
import { useDispatch } from "react-redux";
import fetchAccountData from "../../../Store/accountInfo-actions";
import { toast } from "react-toastify";
import PermissionControl from "./PermissionControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UpdatePermissionsForm from "./ProfileForms/UpdatePermissionsForm";

const MemberItem = ({
  allPermissions,
  userPermissions,
  userData,
  accountId,
  accountOwner,
  permittedCompounds
}) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdatePermissionModal, setShowUpdatePermissionModal] =
    useState(false);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const dispatch = useDispatch();

  const deleteMember = async () => {
    setShowDeleteModal(false);

    if (userData?._id && token) {
      const res = await mainDeleteFunHandler({
        id: userData?._id,
        token: token,
        type: `accounts/${accountId}/members`,
      });

      if (res.status === 204) {
        dispatch(fetchAccountData(token));
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const showUpdatePermissionsHandler = () => {
    setShowPermissionModal(false);
    setShowUpdatePermissionModal(true);
  };

  return (
    <>
      <Col lg={6}>
        <div className={styles.container}>
          <div className="d-flex justify-content-between flex-wrap">
            <div className=" d-flex align-items-center">
              <div className={styles.avatar}>
                <img
                  src={
                    userData?.photo
                      ? `${import.meta.env.VITE_Host}${userData?.photo}`
                      : avatar
                  }
                  alt="profile_pic"
                />
              </div>
              <div className={isArLang ? "me-3" : "ms-3"}>
                <h5 className="m-0 fw-bold">{userData?.name}</h5>
                <span className="mini_word">Estate Manager</span>
              </div>
            </div>
            <div
              className={`d-flex ${isArLang ? "me-auto" : "ms-auto"} ${
                accountOwner === userData?._id ? "d-none" : ""
              }`}
            >
              <FontAwesomeIcon
                className={styles.show_icon}
                onClick={() => setShowPermissionModal(true)}
                icon={faEye}
                title={key("show")}
              />
              <FontAwesomeIcon
                className={styles.delete_icon}
                onClick={() => setShowDeleteModal(true)}
                icon={faTrashCan}
                title={key("delete")}
              />
            </div>
          </div>

          <div className="m-3">
            <div>
              <div className={styles.info}>
                <span>{key("phone")}</span>
                <h6>{userData?.phone}</h6>
              </div>
            </div>

            <div>
              <div className={styles.info}>
                <span>{key("email")}</span>
                <h6>{userData?.email}</h6>
              </div>
            </div>
          </div>
        </div>
      </Col>

      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteMember}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
      {showPermissionModal && (
        <MainModal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
          confirmFun={showUpdatePermissionsHandler}
          cancelBtn={key("save")}
          okBtn={key("ediet")}
          modalSize={"xl"}
        >
          <PermissionControl
            allPermissions={allPermissions}
            userPermissions={userPermissions}
          />
        </MainModal>
      )}

      {showUpdatePermissionModal && (
        <ModalForm
          show={showUpdatePermissionModal}
          onHide={() => setShowUpdatePermissionModal(false)}
        >
          <UpdatePermissionsForm
            allPermissions={allPermissions}
            userPermissions={userPermissions}
            userId={userData?._id}
            permittedCompoundsArr={permittedCompounds}
            hideModal={() => setShowUpdatePermissionModal(false)}
          />
        </ModalForm>
      )}
    </>
  );
};

export default MemberItem;
