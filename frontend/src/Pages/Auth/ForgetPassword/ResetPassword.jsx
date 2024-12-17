import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, useNavigate } from "react-router-dom";
import { signFormsHandler } from "../../../util/Http";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Field, Formik } from "formik";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Modal from "react-bootstrap/Modal";
import styles from "./ForgetPassword.module.css";

const ResetPassword = ({ show, onHide }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const [isRightEmail, setIsRightEmail] = useState(false);
  const navigate = useNavigate();
  const { t: key } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      if (data.data.status === "success") {
        setIsRightEmail(false);
        notifySuccess(key("newPassSaved"));
        navigate("/login");
        onHide();
      } else {
        notifyError(key("newPassFaild"));
      }
    },
    onError: (error) => {
      if (error.data.message === "account with this email not found") {
        setIsRightEmail(true);
      } else {
        setIsRightEmail(false);
        notifyError(key("newPassFaild"));
      }
    },
  });

  const initialValues = {
    email: "",
    newPassword: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      method: "put",
    });
  };

  const validationSchema = object({
    email: string()
      .email(key("emailValidation1"))
      .required(key("emailValidation2")),
    newPassword: string()
      .min(5, `${key("passwordValidation1")}`)
      .required(`${key("passwordValidation2")}`)
      .matches(/[A-Z]+/, `${key("passwordValidation3")}`)
      .matches(/[a-z]+/, `${key("passwordValidation4")}`)
      .matches(/[0-9]+/, `${key("passwordValidation5")}`),
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={styles.modal_body}>
        <h4>{key("newPass")}</h4>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className={styles.field}>
              <label htmlFor="resetPasswordEmail">{key("email")}</label>
              <Field type="email" id="resetPasswordEmail" name="email" />
              {isRightEmail && <InputErrorMessage text={key("noAcc")} />}
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>

            <div className={styles.field}>
              <label htmlFor="newPass">{key("newPass")}</label>

              <Field type="password" id="newPass" name="newPassword" />
              <ErrorMessage name="newPassword" component={InputErrorMessage} />
            </div>

            <div className="d-flex justify-content-center align-items-center mt-3 px-2">
              {isPending ? (
                <button type="submit" className={styles.save_btn}>
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                </button>
              ) : (
                <button className={styles.save_btn} type="submit">
                  {key("confirm")}
                </button>
              )}
            </div>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ResetPassword;
