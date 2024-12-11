import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { object, ref, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonOne from "../../../../Components/UI/Buttons/ButtonOne";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";

const SecurityForm = ({LogOutProcess}) => {
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  };

  const onSubmit = (values, { resetForm }) => {
    mutate(
      {
        formData: values,
        token: token,
        method: "patch",
        type: `users/me/password`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            notifySuccess(key("updatedSucc"));
            resetForm();
            LogOutProcess();
          } else {
            notifyError(key("wrong"));
          }
        },
        onError: (error) => {
          console.log(error);
          notifyError(key("wrong"));
        },
      }
    );
  };

  const validationSchema = object({
    currentPassword: string()
      .min(5, key("min5"))
      .required(key("fieldReq"))
      .matches(/[A-Z]+/, key("validationUpperCase"))
      .matches(/[a-z]+/, key("validationLowerCase"))
      .matches(/[0-9]+/, key("validationNumber")),
    newPassword: string()
      .min(5, key("min5"))
      .required(key("fieldReq"))
      .matches(/[A-Z]+/, key("validationUpperCase"))
      .matches(/[a-z]+/, key("validationLowerCase"))
      .matches(/[0-9]+/, key("validationNumber")),
    passwordConfirm: string()
      .oneOf([ref("newPassword"), null], `${key("passwordMismatch")}`)
      .required(`${key("fieldReq")}`),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <div className="field">
          <Field
            type="password"
            name="currentPassword"
            placeholder={key("currentPassword")}
          />
          <ErrorMessage name="currentPassword" component={InputErrorMessage} />
        </div>

        <div className="field">
          <Field
            type="password"
            name="newPassword"
            placeholder={key("newPassword")}
          />
          <ErrorMessage name="newPassword" component={InputErrorMessage} />
        </div>

        <div className="field">
          <Field
            type="password"
            name="passwordConfirm"
            placeholder={key("passwordConfirm")}
          />
          <ErrorMessage name="passwordConfirm" component={InputErrorMessage} />
        </div>

        <div className="text-center my-4 px-5">
          <ButtonOne type="submit" borderd={true} classes="w-100">
            {isPending ? (
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
            ) : (
              key("update")
            )}
          </ButtonOne>
        </div>
      </Form>
    </Formik>
  );
};

export default SecurityForm;
