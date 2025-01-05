import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { ErrorMessage, Field, Form, Formik } from "../../shared/index";
import { toast, object, string } from "../../shared/constants";
import { useMutation, useTranslation, useSelector } from "../../shared/hooks";
import { InputErrorMessage, ButtonTwo } from "../../shared/components";
import { Row, Col } from "../../shared/bootstrap";

const ContactForm = () => {
  const token = useSelector((state) => state.userInfo.token);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: profileInfo?.name || "",
    email: profileInfo?.email || "",
    phone: profileInfo?.phone || "",
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
            type: `support/messages`,
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
    phone: string().matches(/^05\d{8}$/, key("invalidPhone")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <Row>
          <Col md={6}>
            <div className="field">
              <label htmlFor="name">
                {key("name")} {requiredLabel}
              </label>
              <Field id="name" type="text" name="name" />
              <ErrorMessage name="name" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={6}>
            <div className="field">
              <label htmlFor="email">
                {key("email")} {requiredLabel}
              </label>
              <Field id="email" type="email" name="email" />
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={6}>
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
          </Col>
          <Col md={6}>
            <label htmlFor="subject">
              {key("subject")} {requiredLabel}
            </label>
            <div className="field">
              <Field id="subject" type="text" name="subject" />
              <ErrorMessage name="subject" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={12}>
            <div className="field">
              <label htmlFor="message">
                {key("message")} {requiredLabel}
              </label>
              <Field
                id="message"
                as="textarea"
                className="text_area"
                name="message"
                rows="3"
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
