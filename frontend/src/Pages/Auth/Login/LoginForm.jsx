import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import styles from "../Auth.module.css";
import { signFormsHandler } from "../../../util/Http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import saveUserInfoIntoLocalStorag, {
  saveIsLoginState,
  saveRoleState,
  saveTokenState,
} from "../../../Store/userInfo-actions";
import { userActions } from "../../../Store/userInfo-slice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t: key } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const saveDataIntoRedux = (res) => {
    const role = res?.data?.user?.role;
    const user = res.data.user;
    const token = res.token;

    dispatch(userActions.setUserInfo(user));
    dispatch(userActions.setIsLogin(true));
    dispatch(userActions.setRole(role));
    dispatch(userActions.setToken(token));
    dispatch(saveUserInfoIntoLocalStorag(user));
    dispatch(saveIsLoginState(true));
    dispatch(saveRoleState(role));
    dispatch(saveTokenState(token));
    notifySuccess(key("logged"));
    if (role !== "admin") {
      navigate("/dashboard");
    } else {
      navigate("/admin-dashboard");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (response) => {
      let res = response.data;
      if (res.status === "success") {
        console.log("res", res);
        if (res.data.user) {
          saveDataIntoRedux(res);
        }
      } else {
        console.log(res);
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "Incorrect phone or password") {
        notifyError(key("noPhone"));
      } else {
        console.log(error);
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    phone: "",
    password: "",
  };
  const onSubmit = (values) => {
    mutate({ type: "login", formData: values });
  };

  const validationSchema = object({
    phone: string()
      .matches(/^05\d{8}$/, key("invalidPhone"))
      .required(key("fieldReq")),
    password: string()
      .min(5, key("min5"))
      .required(key("fieldReq"))
      .matches(/[A-Z]+/, key("validationUpperCase"))
      .matches(/[a-z]+/, key("validationLowerCase"))
      .matches(/[0-9]+/, key("validationNumber")),
  });

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const eyeShape = showPassword ? faEye : faEyeSlash;
  const passwordType = showPassword ? "text" : "password";

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.login_form_content}>
          <div className="field">
            <label htmlFor="phoneInput">{key("phone")}</label>
            <Field
              type="tel"
              id="phoneInput"
              name="phone"
              placeholder="05XXXXXXXX"
            />
            <ErrorMessage name="phone" component={InputErrorMessage} />
          </div>
          <div className="field position-relative">
            <label htmlFor="passwordInput">{key("password")}</label>
            <Field
              type={passwordType}
              id="passwordInput"
              name="password"
              placeholder="*****"
            />
            <ErrorMessage name="password" component={InputErrorMessage} />
            <FontAwesomeIcon
              onClick={toggleShowPassword}
              className={
                isArLang ? styles.show_pass_eye_ar : styles.show_pass_eye
              }
              icon={eyeShape}
            />
          </div>
          <div className="text-center my-4 px-5">
            <ButtonOne type="submit" borderd={true} classes="w-100">
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("login")
              )}
            </ButtonOne>
          </div>

          <div className={styles.form_options}>
            <span>
              <Link to={"/forget-password"}>{key("forgotPass")}</Link>
            </span>
            <span>
              {key("creatAcc")} <Link to={"/register"}>{key("register")}</Link>
            </span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
