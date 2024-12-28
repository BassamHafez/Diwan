import { ErrorMessage, Field, Form, Formik } from "formik";
import ButtonTwo from "../../Components/UI/Buttons/ButtonTwo";
import InputErrorMessage from "../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { object, string } from "yup";

const ContactForm = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { mutate } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const onSubmit = (values, { resetForm }) => {
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "add",
            type: `contactUs`,
          },
          {
            onSuccess: (data) => {
              if (data?.status === "success") {
                resetForm();
                resolve(key("sentSuccess"));
              } else {
                reject(key("wrong"));
              }
            },
            onError: (error) => {
              console.log(error);
              reject(key("wrong"));
            },
          }
        );
      }),
      {
        pending: key(key("sendingMessage")),
        success: key("sentSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object().shape({
    name: string().required(key("fieldReq")),
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
    subject: string().required(key("fieldReq")),
    message: string()
      .min(5, key("min5"))
      .required(`${key("fieldReq")}`),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
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
          <ButtonTwo type="submit" text={key("sendMsg")} />
        </div>
      </Form>
    </Formik>
  );
};

export default ContactForm;
