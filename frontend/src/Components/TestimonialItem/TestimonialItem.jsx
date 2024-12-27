import styles from "./TestimonialItem.module.css";
import noAvatar from "../../assets/default.png";
import ButtonOne from "../UI/Buttons/ButtonOne";
import MainModal from "../UI/Modals/MainModal";
import { useState } from "react";
import { mainDeleteFunHandler } from "../../util/Http";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import UpdateTestimonial from "../../Pages/Admin/AdminTestimonials/TestimonialsForms/UpdateTestimonial";
import ModalForm from "../UI/Modals/ModalForm";

const TestimonialItem = ({ content, isAdmin, refetch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateTestimonialsModal, setShowUpdateTestmonialsModal] =
    useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const deletePack = async () => {
    setShowDeleteModal(false);
    if (content?._id && token) {
      const res = await mainDeleteFunHandler({
        id: content?._id,
        token: token,
        type: `testimonials`,
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
      <div className={`${styles.slide_content} ${isAdmin?styles.admin_width:""}`}>
        <div className={`${styles.slide_header} d-flex align-items-center`}>
          <img
            src={
              content?.image
                ? `${import.meta.env.VITE_Host}${content?.image}`
                : noAvatar
            }
            className={`${styles.person}`}
            alt="person"
          />
          <div
            className={`${styles.slide_header_caption} d-flex flex-column  ${
              isArLang ? "me-3" : "ms-3"
            }`}
          >
            <h5 className={styles.person_name}>{content?.name}</h5>
            <span className={styles.person_date}>{content?.title}</span>
          </div>
        </div>
        <div className={`${styles.person_comment} ${isAdmin?styles.dashed_border:""}`}>
          <p>{content?.comment}</p>
        </div>

        {isAdmin && (
          <div
            className={`${styles.controller_div} d-flex justify-content-between align-items-center flex-wrap position-relative mt-3`}
          >
            <ButtonOne
              text={key("delete")}
              classes="bg-danger m-2"
              borderd={true}
              onClick={() => setShowDeleteModal(true)}
            />

            <ButtonOne
              text={key("ediet")}
              classes="bg-navy m-2"
              borderd={true}
              onClick={() => setShowUpdateTestmonialsModal(true)}
            />
          </div>
        )}
      </div>

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

      {showUpdateTestimonialsModal && (
        <ModalForm
          show={showUpdateTestimonialsModal}
          onHide={() => setShowUpdateTestmonialsModal(false)}
        >
          <UpdateTestimonial
            refetch={refetch}
            hideModal={() => setShowUpdateTestmonialsModal(false)}
            content={content}
          />
        </ModalForm>
      )}
    </>
  );
};

export default TestimonialItem;
