import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { signFormsHandler } from "../../../util/Http";
import { object, string } from "yup";
import ResetPassword from "./ResetPassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Modal from "react-bootstrap/Modal";
import styles from "./ForgetPassword.module.css";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";

const VerificationCode = ({ show, onHide }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const [isCodeWrong, setIsCodeWrong] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t: key } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.status === "Success") {
        setIsCodeWrong(false);
        setShowModal(true);
        onHide();
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "Invalid reset code or expired") {
        setIsCodeWrong(true);
        notifyError(key("wrongVerificationCode"));
      } else {
        setIsCodeWrong(false);
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    resetCode: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      type: "verifyResetCode",
    });
  };

  const validationSchema = object({
    resetCode: string().required(key("codeRec")),
  });

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.modal_container}
      >
        <Modal.Body className={styles.modal_body}>
          <h4>{key("enterCode")}</h4>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <div className={styles.verify_form}>
                <Field
                  type="text"
                  id="forgetPasswordEmail"
                  name="resetCode"
                  placeholder="######"
                />
                {isCodeWrong && (
                  <InputErrorMessage text={key("resetInvalid")} />
                )}
                <ErrorMessage name="resetCode" component={InputErrorMessage} />
              </div>

              <div className="d-flex justify-content-center align-items-center mt-3 px-2">
                {isPending ? (
                  <button type="submit" className="submit_btn">
                    <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                  </button>
                ) : (
                  <button className="submit_btn" type="submit">
                    {key("verify")}
                  </button>
                )}
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>

      <ResetPassword
        show={showModal}
        onHide={() => setShowModal(true)}
        notifySuccess={notifySuccess}
        notifyError={notifyError}
      />
    </>
  );
};

export default VerificationCode;
