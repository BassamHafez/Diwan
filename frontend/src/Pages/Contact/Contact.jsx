import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "./Contact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faEnvelope,
  faMapMarkedAlt,
  faPhoneFlip,
} from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ButtonTwo from "../../Components/UI/Buttons/ButtonTwo";
import InputErrorMessage from "../../Components/UI/Words/InputErrorMessage";
import ContactsIcon from "../../Components/UI/ContactsIcon/ContactsIcon";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <section className="over" id="Contact">
      <Row>
        <Col md={5} className={styles.contact_info}>
          <div className={`${styles.contact_info_layer} p-4`}>
            <div className={isArLang?styles.contact_links_ar:styles.contact_links}>
              {/* <!-- data num 1 --> */}
              <div className="d-flex mb-3">
                <div className={isArLang?"ms-3":"me-3"}>
                  <FontAwesomeIcon
                    className={styles.contact_info_icon}
                    icon={faPhoneFlip}
                  />
                </div>
                <div className="d-flex flex-column">
                  <h6 className={styles.data_link_h6}>{key("phone")} :</h6>
                  <p className={styles.data_link_p}>
                    +20 010 251 789 18 , 371 789 18
                  </p>
                </div>
              </div>

              {/* <!-- data num 2 --> */}
              <div className="d-flex mb-3">
                <div className={isArLang?"ms-3":"me-3"}>
                  <FontAwesomeIcon
                    className={styles.contact_info_icon}
                    icon={faEnvelope}
                  />
                </div>
                <div className="d-flex flex-column">
                  <h6 className={styles.data_link_h6}>{key("email")} :</h6>
                  <p className={styles.data_link_p}>
                    EasyJob_support@website.com
                  </p>
                </div>
              </div>

              {/* <!-- data num 3 --> */}
              <div className="d-flex mb-3">
                <div className={isArLang?"ms-3":"me-3"}>
                  <FontAwesomeIcon
                    className={styles.contact_info_icon}
                    icon={faMapMarkedAlt}
                  />
                </div>
                <div className="d-flex flex-column">
                  <h6 className={styles.data_link_h6}>{key("address")} :</h6>
                  <p className={styles.data_link_p}>
                    4655 Elwehda Street, Imbaba, Illinois <br />
                    4961 Wescam Court, Reno, Nevada
                  </p>
                </div>
              </div>

              <div className={styles.contact_info_icons}>
                <ContactsIcon type="two" />
              </div>
            </div>
          </div>
        </Col>
        <Col md={7} className="py-5">
          <div className="special_main_color text-center m-auto my-5">
            <h6 className={styles.sub_title}>{key("getInTouch")}</h6>
            <h2 className={styles.form_title}>{key("contactUs")}</h2>
            <FontAwesomeIcon icon={faCaretDown} />  
          </div>
          <Formik
          // initialValues={initialValues}
          // onSubmit={onSubmit}
          // validationSchema={validationSchema}
          // enableReinitialize
          >
            <Form>
              <div className="form-group p-3">
                <Row className="justify-content-center">
                  <Col md={6} className="mb-4 p-2 position-relative">
                    <Field
                      type="text"
                      id="form-name"
                      placeholder={key("name")}
                      className="form-control"
                      name="name"
                      required
                    />
                    <ErrorMessage name="name" component={InputErrorMessage} />
                  </Col>
                  <Col md={6} className="mb-4 p-2 position-relative">
                    <Field
                      type="email"
                      id="form-email"
                      placeholder={key("email")}
                      className="form-control"
                      name="email"
                      required
                    />
                    <ErrorMessage name="email" component={InputErrorMessage} />
                  </Col>
                  <Col md={12} className="mb-4 p-2 position-relative">
                    <Field
                      type="text"
                      id="form-subject"
                      placeholder={key("subject")}
                      className="form-control"
                      name="subject"
                      required
                    />
                    <ErrorMessage
                      name="subject"
                      component={InputErrorMessage}
                    />
                  </Col>
                  <Col md={12} className="mb-4 p-2 position-relative">
                    <Field
                      as="textarea"
                      name="message"
                      id="form-message"
                      className="form-control"
                      rows="3"
                      required
                      placeholder={key("message")}
                    />
                  </Col>
                  <ErrorMessage name="message" component={InputErrorMessage} />
                </Row>

                <div className="text-center">
                  <ButtonTwo>{key("sendMsg")}</ButtonTwo>
                </div>
              </div>
            </Form>
          </Formik>
        </Col>
      </Row>
    </section>
  );
};

export default Contact;
