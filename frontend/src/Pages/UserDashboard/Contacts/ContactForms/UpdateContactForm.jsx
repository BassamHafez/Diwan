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

const UpdateContactForm = ({
  hideModal,
  contactType,
  refetch,
  refetchAllContacts,
  contact,
}) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const tenantTypeOptions = [
    { label: key("individual"), value: "individual" },
    { label: key("organization"), value: "organization" },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: contact.name || "",
    phone: contact.phone || "",
    phone2: contact.phone2 || "",
    notes: contact.notes || "",
    type: contact.type || "",
    nationalId: contact.nationalId || "",
    address: contact.address || "",
    commercialRecord: contact.commercialRecord || "",
    taxNumber: contact.taxNumber || "",
    contactType: contactType || "",
  };

  const onSubmit = (values, { resetForm }) => {
    const { contactType, commercialRecord, taxNumber, ...updatedValues } =
      values;

    if (commercialRecord)
      updatedValues.commercialRecord = String(commercialRecord);
    if (taxNumber) updatedValues.taxNumber = String(taxNumber);

    const filteredValues = Object.fromEntries(
      Object.entries(updatedValues).filter(([, value]) => value !== "")
    );

    if ("type" in filteredValues) {
      delete filteredValues.type;
    }

    console.log(filteredValues);
    mutate(
      {
        formData: filteredValues,
        token: token,
        method: "patch",
        type: `contacts/${contactType}s/${contact._id}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            if (refetch) {
              refetch();
            }
            refetchAllContacts();
            notifySuccess(key("updatedSucc"));
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

  const validationSchema = object().shape({
    name: string().required(key("fieldReq")),
    phone: string()
      .matches(/^05\d{8}$/, key("invalidPhone"))
      .required(key("fieldReq")),
    phone2: string().matches(/^05\d{8}$/, key("invalidPhone")),
    notes: string(),
    nationalId: string().when("type", {
      is: (type) => type === "individual",
      then: (schema) =>
        schema
          .matches(/^(1|2)\d{9}$/, key("nationalIdValidation"))
          .required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
    address: string().when("type", {
      is: (type) => type === "organization",
      then: (schema) => schema.required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
    commercialRecord: string().when("type", {
      is: (type) => type === "organization",
      then: (schema) =>
        schema
          .matches(/^\d{10}$/, key("CommercialValidation"))
          .required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
    taxNumber: string().when("type", {
      is: (type) => type === "organization",
      then: (schema) =>
        schema
          .matches(/^3\d{14}$/, key("taxNumberValidation"))
          .required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
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
          {contactType === "tenant" && (
            <>
              <div className="field mb-1">
                <label htmlFor="tenantType">
                  {key("tenantType")} {requiredLabel}
                </label>
                <Select
                  id="tenantType"
                  name="type"
                  options={tenantTypeOptions}
                  onChange={(val) => setFieldValue("type", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                  value={tenantTypeOptions.find(
                    (val) => val.value === contact.type
                  )}
                  isDisabled={true}
                />
                <ErrorMessage name="type" component={InputErrorMessage} />
              </div>

              {contact?.type === "individual" && (
                <div className="field">
                  <label htmlFor="nationalId">
                    {key("nationalId")} {requiredLabel}
                  </label>
                  <Field type="text" id="nationalId" name="nationalId" />
                  <ErrorMessage
                    name="nationalId"
                    component={InputErrorMessage}
                  />
                </div>
              )}
              {contact?.type === "organization" && (
                <>
                  <div className="field">
                    <label htmlFor="address">
                      {key("address")} {requiredLabel}
                    </label>
                    <Field type="text" id="address" name="address" />
                    <ErrorMessage
                      name="address"
                      component={InputErrorMessage}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="commercialRecord">
                      {key("commercialRecord")} {requiredLabel}
                    </label>
                    <Field
                      type="number"
                      placeholder="XXXXXXXXXX"
                      id="commercialRecord"
                      name="commercialRecord"
                    />
                    <ErrorMessage
                      name="commercialRecord"
                      component={InputErrorMessage}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="taxNumber">
                      {key("taxNumber")} {requiredLabel}
                    </label>
                    <Field
                      type="number"
                      placeholder="3XXXXXXXXXXXXXX"
                      id="taxNumber"
                      name="taxNumber"
                    />
                    <ErrorMessage
                      name="taxNumber"
                      component={InputErrorMessage}
                    />
                  </div>
                </>
              )}
            </>
          )}

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
          {contactType !== "tenant" && (
            <div className="field">
              <label htmlFor="notes">{key("notes")}</label>
              <Field
                as="textarea"
                className="text_area"
                id="notes"
                name="notes"
              />
              <ErrorMessage name="notes" component={InputErrorMessage} />
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
            <button onClick={hideModal} className="cancel_btn my-2">
              {key("cancel")}
            </button>

            <button className="submit_btn my-2" type="submit">
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("update")
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateContactForm;
