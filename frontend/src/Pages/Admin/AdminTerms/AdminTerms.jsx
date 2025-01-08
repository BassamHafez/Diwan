import { terms } from "../../../Components/Logic/StaticLists";
import { ButtonOne, MainTitle, ModalForm } from "../../../shared/components";
import { useTranslation, useCallback, useState } from "../../../shared/hooks";
import styles from "../Admin.module.css";
import UpdateTermsForm from "./AdminTermsForm/UpdateTermsForm";

const AdminTerms = ({ isUserPage }) => {
  // const configs = useSelector((state) => state.configs);
  const [showUpdateermsModal, setShowUpdateTermsModal] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const containerClasses = `${styles.terms_container} ${
    isUserPage ? styles.transpatent_color : ""
  }`;
  const handleShowModal = useCallback(() => setShowUpdateTermsModal(true), []);
  const handleHideModal = useCallback(() => setShowUpdateTermsModal(false), []);

  const ArabicContent = (
    <div dir="rtl" className={containerClasses}>
      <div className="mb-3">
        <MainTitle colored={true} title={key("termsAr")} />
      </div>
      <ol className={styles.terms_list}>
        {terms["ar"].map((term, index) => (
          <li key={index}>{term}</li>
        ))}
      </ol>
    </div>
  );

  const EnglishContent = (
    <div dir="ltr" className={containerClasses}>
      <div className="mb-3">
        <MainTitle colored={true} title={key("termsEn")} />
      </div>
      <ol className={styles.terms_list}>
        {terms["en"].map((term, index) => (
          <li key={index}>{term}</li>
        ))}
      </ol>
    </div>
  );

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {/* {(!configs) && <LoadingOne />} */}
        {!isUserPage && (
          <div className="d-flex justify-content-end align-items-center position-relative my-3 p-2">
            <div>
              <ButtonOne
                onClick={handleShowModal}
                borderd={true}
                text={key("update")}
              />
            </div>
          </div>
        )}
        {isUserPage ? (isArLang ? ArabicContent : null) : ArabicContent}
        {isUserPage ? (isArLang ? null : EnglishContent) : EnglishContent}
      </div>

      {showUpdateermsModal && (
        <ModalForm show={showUpdateermsModal} onHide={handleHideModal}>
          <UpdateTermsForm terms={terms} hideModal={handleHideModal} />
        </ModalForm>
      )}
    </>
  );
};

export default AdminTerms;
