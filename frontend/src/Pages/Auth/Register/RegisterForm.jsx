import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, ref, string } from "yup";
import styles from "../Auth.module.css";
import { signFormsHandler } from "../../../util/Http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RegisterForm = () => {
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,

    onSuccess: (response) => {
      console.log(response)
      if (response.data.status === "success") {
        notifySuccess(key("registeredSuccess"));
        navigate("/login");
      } else {
        notifyError("wrong");
      }
    },
    onError(error) {
      console.log(error)
      if (error.status === 500) {
        if (
          error.data.message ===
          "connection <monitor> to 15.185.166.107:27017 timed out"
        ) {
          notifyError(key("timeout"));
        } else {
          notifyError(key("existError"));
        }
      } else if (error.data.message.split(" ")[0] === "Duplicate") {
        notifyError(key("duplicate"));
      } else {
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  };

  const onSubmit = (values) => {
    mutate({ type: "signup", formData: values });
  };

  const validationSchema = object({
    name: string()
      .min(3, `${key("nameValidation1")}`)
      .max(20, `${key("nameValidation2")}`)
      .required(`${key("nameValidation3")}`),
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
    phone: string()
      .matches(/^05\d{8}$/, key("invalidPhone"))
      .required(key("fieldReq")),
    password: string()
      .min(5, key("min5"))
      .required(key("fieldReq"))
      .matches(/[A-Z]+/, key("validationUpperCase"))
      .matches(/[a-z]+/, key("validationLowerCase"))
      .matches(/[0-9]+/, key("validationNumber")),
    passwordConfirm: string()
      .oneOf([ref("password"), null], `${key("passwordMismatch")}`)
      .required(`${key("fieldReq")}`),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.login_form_content}>
          <div className="field mb-2">
            <Field type="text" name="name" placeholder={key("name")} />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field type="email" name="email" placeholder={`${key("email")}`} />
            <ErrorMessage name="email" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field
              type="tel"
              id="phoneInput"
              name="phone"
              placeholder={key("phone")}
              className={isArLang?"ar_direction":""}
            />
            <ErrorMessage name="phone" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field
              type="password"
              name="password"
              placeholder={key("password")}
            />
            <ErrorMessage name="password" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field
              type="password"
              name="passwordConfirm"
              placeholder={key("passwordConfirm")}
            />
            <ErrorMessage
              name="passwordConfirm"
              component={InputErrorMessage}
            />
          </div>

          <div className="text-center my-4 px-5">
            <ButtonOne type="submit" borderd={true} classes="w-100">
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("register")
              )}
            </ButtonOne>
          </div>

          <div className={styles.form_options}>
            <span>
              {key("haveAcc")} <Link to={"/login"}>{key("login")}</Link>
            </span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default RegisterForm;
