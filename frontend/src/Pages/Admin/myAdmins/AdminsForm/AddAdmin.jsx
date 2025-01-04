import { mainFormsHandlerTypeRaw } from "../../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../../shared/index";
import {
  faSpinner,
  toast,
  object,
  string,
  ref,
} from "../../../../shared/constants";
import { useMutation, useTranslation } from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const AddAdmin = ({ refetch, hideModal }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  };

  const onSubmit = (values, { resetForm }) => {
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "add",
            type: "users/admin",
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                if (refetch) {
                  refetch();
                }
                resolve();
                resetForm();
                hideModal();
              } else if (
                data?.response?.data?.message?.split(" ")[0] === "Duplicate"
              ) {
                reject();
              } else {
                reject();
              }
            },
            onError: (error) => {
              console.log(error);
              reject();
            },
          }
        );
      }),
      {
        pending: key(key("saving")),
        success: key("addedSuccess"),
        error: key("duplicateError"),
      }
    );
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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <Row>
          <Col sm={6}>
            <div className="field">
              <Field type="text" name="name" placeholder={key("name")} />
              <ErrorMessage name="name" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
              <Field
                type="email"
                name="email"
                placeholder={`${key("email")}`}
              />
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={12}>
            <div className="field">
              <Field
                type="tel"
                id="phoneInput"
                name="phone"
                placeholder={key("phone")}
                className={isArLang ? "ar_direction" : ""}
              />
              <ErrorMessage name="phone" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
              <Field
                type="password"
                name="password"
                placeholder={key("password")}
              />
              <ErrorMessage name="password" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
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
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn my-2" type="submit">
            {isPending ? (
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
            ) : (
              key("add")
            )}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default AddAdmin;
