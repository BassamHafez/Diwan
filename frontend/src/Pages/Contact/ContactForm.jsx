import { ErrorMessage, Field, Form, Formik } from "formik";
import ButtonTwo from "../../Components/UI/Buttons/ButtonTwo";
import InputErrorMessage from "../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t: key } = useTranslation();

  return (
    <Formik
    // initialValues={initialValues}
    // onSubmit={onSubmit}
    // validationSchema={validationSchema}
    >
      <Form>
        <Row>
          <Col md={6}>
            <div className="field">
              <Field type="text" placeholder={key("name")} name="name" />
              <ErrorMessage name="name" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={6}>
            <div className="field">
              <Field type="email" placeholder={key("email")} name="email" />
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={12}>
            <div className="field">
              <Field type="text" placeholder={key("subject")} name="subject" />
              <ErrorMessage name="subject" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={12}>
            <div className="field">
              <Field
                as="textarea"
                className="text_area"
                name="message"
                rows="3"
                placeholder={key("message")}
              />
              <ErrorMessage name="message" component={InputErrorMessage} />
            </div>
          </Col>
        </Row>

        <div className="text-center">
          <ButtonTwo type="submit" text={key("sendMsg")}/>
        </div>
      </Form>
    </Formik>
  );
};

export default ContactForm;
