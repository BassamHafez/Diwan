import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import Select from "react-select";
import {
  contactsTypeAr,
  contactsTypeEn,
} from "../../../../Components/Logic/StaticLists";

const AddContactForm = ({ refetch, hideModal }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: "",
    phone: "",
    phone2: "",
    type: "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values);

    const updatedValues = {
      name: values.name,
      phone: values.phone,
      type: values.type,
    };

    if (values.phone2!== "") {
      updatedValues.phone2 = values.phone2;
    }

    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "add",
        type: "contacts",
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            notifySuccess(key("addedSuccess"));
            resetForm();
            hideModal();
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
    name: string().required(key("fieldReq")),
    phone: string()
      .matches(/^05\d{8}$/, key("invalidPhone"))
      .required(key("fieldReq")),
    phone2: string().matches(/^05\d{8}$/, key("invalidPhone")),
    type: string().required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className="field">
            <label htmlFor="name">
              {key("name")} {requiredLabel}
            </label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>
          <div className="field mb-1">
            <label htmlFor="type">
              {key("type")} {requiredLabel}
            </label>
            <Select
              id="type"
              name="type"
              options={isArLang ? contactsTypeAr : contactsTypeEn}
              onChange={(val) => setFieldValue("type", val.value)}
              className={`${isArLang ? "text-end" : "text-start"}`}
              isRtl={isArLang ? false : true}
              placeholder={isArLang ? "" : "select"}
            />
            <ErrorMessage name="type" component={InputErrorMessage} />
          </div>
          <div className="field">
            <label htmlFor="phoneInput">
              {key("phone")} {requiredLabel}
            </label>
            <Field
              type="tel"
              id="phoneInput"
              name="phone"
              placeholder="05XXXXXXXX"
            />
            <ErrorMessage name="phone" component={InputErrorMessage} />
          </div>
          <div className="field">
            <label htmlFor="phoneInput2">{key("phone2")}</label>
            <Field
              type="tel"
              id="phoneInput2"
              name="phone2"
              placeholder="05XXXXXXXX"
            />
            <ErrorMessage name="phone2" component={InputErrorMessage} />
          </div>

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
      )}
    </Formik>
  );
};

export default AddContactForm;
