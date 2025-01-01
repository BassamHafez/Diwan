import { useTranslation } from "react-i18next";
import styles from "../Auth.module.css";
import LoginForm from "./LoginForm";
import loginImg from "../../../assets/signin.webp";
import { useEffect } from "react";
import AOS from "aos";

const Login = () => {

  const {t:key}=useTranslation();

  useEffect(() => {
    AOS.init({disable: 'mobile'});;
  }, []);

  return (
    <div className={styles.login_container}>
      <div className={styles.layer}></div>
      <div
        className={styles.login_content}
        data-aos="zoom-in-up"
        data-aos-duration="800"
      >
        <div className={styles.login_caption}>
          <div className={styles.caption_vector}>
            <img src={loginImg} alt="loginImg" />
          </div>
        </div>
        <div className={styles.login_form}>
          <h3>{key("login")}</h3>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
