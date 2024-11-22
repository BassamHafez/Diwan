import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, number, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  mainFormsHandlerTypeFormData,
  mainFormsHandlerTypeRaw,
} from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { revenueTypeOptions } from "../../../Components/Logic/StaticLists";

const AddRevenue = ({ hideModal, refetch }) => {
  const [tenantsOption, setTenantOption] = useState([]);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { propId } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const { data: tenants } = useQuery({
    queryKey: ["tenants", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "contacts/tenants", token: token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  useEffect(() => {
    let myTenants = tenants?.data?.map((tenant) => {
      return { label: tenant.name, value: tenant._id };
    });
    setTenantOption(myTenants);
  }, [tenants]);

  const initialValues = {
    tenant: "",
    amount: "",
    dueDate: "",
    note: "",
    type: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      tenant: values.tenant,
      amount: Number(values.amount),
      dueDate: values.dueDate,
      type: values.type,
    };
    console.log(values)
    if (values.note) {
      updatedValues.note = values.note;
    }

    console.log(updatedValues)
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "add",
        type: `estates/${propId}/revenues`,
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

  const validationSchema = object().shape({
    tenant: string().required(key("fieldReq")),
    amount: number().required(key("fieldReq")),
    dueDate: date()
      .required(key("fieldReq"))
      .test(
        "is-present-or-future",
        key("startDateValidation"),
        function (value) {
          if (!value) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(value) >= today;
        }
      ),
    type: string().required(key("fieldReq")),
    note: string(),
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
                <label htmlFor="tenant">
                  {key("tenant")} {requiredLabel}
                </label>
                <Select
                  id="tenant"
                  name="tenant"
                  options={tenantsOption}
                  onChange={(val) => setFieldValue("tenant", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="tenant" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="amount">
                  {key("amount")} {requiredLabel}
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
                  options={isArLang?revenueTypeOptions["ar"]:revenueTypeOptions["en"]}
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
                  {key("dueDate")}
                  {requiredLabel}
                </label>
                <Field type="date" id="dueDate" name="dueDate" />
                <ErrorMessage name="dueDate" component={InputErrorMessage} />
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

export default AddRevenue;
