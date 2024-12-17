import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import { signFormsHandler } from "../../../util/Http";
import styles from "./ForgetPassword.module.css";
import forgetPassImg from "../../../assets/forgetPassword.png";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import VerificationCode from "./VerificationCode";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";

const ForgetPassword = () => {
  const [isRightEmail, setIsRightEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t: key } = useTranslation();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.status === "Success") {
        setIsRightEmail(false);
        notifySuccess(key("checkResetPass"));
        setShowModal(true);
      } else {
        notifyError(key("faildResetPass"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "account with this email not found") {
        setIsRightEmail(true);
      } else {
        setIsRightEmail(false);
        notifyError(key("faildResetPass"));
      }
    },
  });

  const initialValues = {
    email: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      type: "forgotPassword",
    });
  };

  const validationSchema = object({
    email: string()
      .email(key("emailValidation1"))
      .required(key("emailValidation2")),
  });

  return (
    <>
      <div
        style={{ backgroundColor: "var(--sub_light)", minHeight: "88vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Row className={`${styles.row_container} my-5 mx-4`}>
          <Col
            sm={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              <Form>
                <div className={styles.form_header}>
                  <h3>{key("forgetTitle")}</h3>
                  <span className="mini_word">
                    {key("enterEmailToSendCode")}
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="getPassEmail">{key("email")}</label>
                  <Field type="email" id="getPassEmail" name="email" />
                  {isRightEmail && <InputErrorMessage text={key("noAcc")} />}
                  <ErrorMessage name="email" component={InputErrorMessage} />
                </div>

                <div className="d-flex justify-content-center align-items-center mt-3 px-2">
                  <ButtonOne borderd type="submit" classes="w-sm-50">
                    {isPending ? (
                      <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                    ) : (
                      key("sendEmail")
                    )}
                  </ButtonOne>
                </div>

                <div className={styles.options}>
                  <span className="or_span mb-4">{key("or")}</span>

                  <span className="mini_word">
                    {key("youCanCreateAcc")}{" "}
                    <Link to={"/register"} className="text-primary">
                      {key("register")}
                    </Link>
                  </span>
                </div>
              </Form>
            </Formik>
          </Col>
          <Col
            sm={6}
            className="d-flex justify-content-center align-items-center"
          >
            <div className={styles.img_side}>
              <img className="w-100" src={forgetPassImg} alt="forgetPassImg" />
            </div>
          </Col>
        </Row>
      </div>
      {showModal && (
        <VerificationCode show={showModal} onHide={() => setShowModal(true)} />
      )}
    </>
  );
};

export default ForgetPassword;
