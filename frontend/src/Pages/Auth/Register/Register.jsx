import { useTranslation } from "react-i18next";
import styles from "../Auth.module.css";
import registerImg from "../../../assets/register.webp";
import { useEffect } from "react";
import AOS from "aos";
import RegisterForm from "./RegisterForm";

const Register = () => {

  const { t: key } = useTranslation();

  useEffect(() => {
    AOS.init({disable: 'mobile'});;
  }, []);

  return (
    <div className={styles.login_container}>
      <div
        className={styles.login_content}
        data-aos="zoom-in-up"
        data-aos-duration="800"
      >
        <div className={styles.login_caption}>
          <div className={styles.caption_vector}>
            <img src={registerImg} alt="registerImg" />
          </div>
        </div>
        <div className={styles.login_form}>
          <h3>{key("register")}</h3>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
