import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, number, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { useParams } from "react-router-dom";
import {
  mainFormsHandlerTypeFormData,
  mainFormsHandlerTypeRaw,
} from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { expensesTypeOptions } from "../../../Components/Logic/StaticLists";
import { useEffect, useState } from "react";
import { convertTpOptionsFormate } from "../../../Components/Logic/LogicFun";

const AddExpenses = ({ hideModal, refetch, isCompound }) => {
  const [contactServicesOptions, setContactServicesOptions] = useState([]);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const params = useParams();

  const myParam = isCompound ? params.compId : params.propId;

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
    amount: "",
    dueDate: "",
    note: "",
    type: "",
    contact: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      amount: values.amount,
      dueDate: values.dueDate,
      type: values.type,
    };

    if (values.note) {
      updatedValues.note = values.note;
    }
    if (!isCompound) {
      updatedValues.estate = myParam;
    } else {
      updatedValues.compound = myParam;
    }
    if (values.contact) {
      updatedValues.contact = values.contact;
    }

    console.log(updatedValues);
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "add",
        type: `expenses`,
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
    amount: number().required(key("fieldReq")),
    dueDate: date().required(key("fieldReq")),
    type: string().required(key("fieldReq")),
    note: string(),
    contact: string().nullable(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
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
                  options={
                    isArLang
                      ? expensesTypeOptions["ar"]
                      : expensesTypeOptions["en"]
                  }
                  onChange={(val) => setFieldValue("type", val.value)}
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
                  options={contactServicesOptions}
                  onChange={(val) =>
                    setFieldValue("contact", val ? val.value : null)
                  }
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
                  key("add")
                )}
              </button>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default AddExpenses;
