import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, number, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import {
  mainFormsHandlerTypeFormData,
  mainFormsHandlerTypeRaw,
} from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { expensesTypeOptions } from "../../../Components/Logic/StaticLists";
import {
  convertTpOptionsFormate,
  formattedDate,
} from "../../../Components/Logic/LogicFun";
import { useEffect, useState } from "react";

const UpdateExpenses = ({ hideModal, refetch, exDetails,refetchDetails }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [contactServicesOptions, setContactServicesOptions] = useState([]);

  const { data: services } = useQuery({
    queryKey: ["service", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/services",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  useEffect(() => {
    setContactServicesOptions(convertTpOptionsFormate(services?.data));
  }, [services]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    amount: exDetails.amount || "",
    dueDate: formattedDate(exDetails.dueDate) || "",
    note: exDetails.note || "",
    type: isArLang
      ? expensesTypeOptions["ar"]?.find((type) => type.value === exDetails.type)
      : expensesTypeOptions["en"]?.find(
          (type) => type.value === exDetails.type
        ) || "",
    contact: exDetails.contact
      ? contactServicesOptions?.find(
          (contact) => contact.value === exDetails.contact || ""
        )
      : "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      amount: values.amount,
      dueDate: values.dueDate,
      type: values.type?.value,
    };

    if (values.note) {
      updatedValues.note = values.note;
    }
    if (values.contact) {
      updatedValues.contact = values.contact;
    }

    console.log(updatedValues);
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "patch",
        type: `expenses/${exDetails._id}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            refetchDetails()
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

  const validationSchema = object({
    title: string().required(key("fieldReq")),
    amount: number().required(key("fieldReq")),
    dueDate: date().required(key("fieldReq")),
    type: object()
      .shape({
        label: string(),
        value: string(),
      })
      .required(key("fieldReq")),
    note: string(),
    contact: object()
      .shape({
        label: string(),
        value: string(),
      })
      .nullable(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="amount">
                  {key("amount")} ({key("sarSmall")}) {requiredLabel}
                </label>
                <Field type="number" id="amount" name="amount" />
                <ErrorMessage name="amount" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="type">
                  {key("type")} {requiredLabel}
                </label>
                <Select
                  id="type"
                  name="type"
                  value={values.type}
                  options={
                    isArLang
                      ? expensesTypeOptions["ar"]
                      : expensesTypeOptions["en"]
                  }
                  onChange={(val) => setFieldValue("type", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="type" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="dueDate">
                  {key("dueDate2")}
                  {requiredLabel}
                </label>
                <Field type="date" id="dueDate" name="dueDate" />
                <ErrorMessage name="dueDate" component={InputErrorMessage} />
              </div>
            </Col>

            <Col sm={6}>
              <div className="field">
                <label htmlFor="contact">{key("singleContactType")}</label>
                <Select
                  id="contact"
                  name="contact"
                  value={values.contact}
                  options={contactServicesOptions}
                  onChange={(val) => setFieldValue("contact", val ? val : null)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                  isClearable
                />
                <ErrorMessage name="contact" component={InputErrorMessage} />
              </div>
            </Col>

            <div className="field">
              <label htmlFor="notes">{key("notes")}</label>
              <Field
                as="textarea"
                className="text_area"
                id="notes"
                name="note"
              />
              <ErrorMessage name="note" component={InputErrorMessage} />
            </div>

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
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateExpenses;
