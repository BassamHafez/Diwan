import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, object, string } from "yup";
import { faCouch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useState } from "react";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import styles from "./ReportForm.module.css";
import { faBuilding } from "@fortawesome/free-regular-svg-icons";
import { contractStatusOptions } from "../../../../Components/Logic/StaticLists";
import CheckPermissions from "../../../../Components/CheckPermissions/CheckPermissions";

const ReportsForm = ({
  compoundsOptions,
  estatesOptions,
  landlordOptions,
  getSearchData,
  type,
}) => {
  const [isCompound, setIsCompound] = useState(false);
  const { t: key } = useTranslation();

  const token = JSON.parse(localStorage.getItem("token"));
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const currentLang = isArLang ? "ar" : "en";
  const permissionArr =
    type !== "contractsReport" ? "FINANCIAL_REPORTS" : "CONTRACTS_REPORTS";
  const requiredLabel = <span className="text-danger">*</span>;

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const paymentStatusOptions = [
    { label: key("paid"), value: "paid" },
    { label: key("pending"), value: "pending" },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    landlord: "",
    estate: "",
    compound: "",
    startDate: "",
    endDate: "",
    status: "",
  };

  const onSubmit = (values) => {
    let updatedValues;
    if (type === "paymentsReport" || type === "contractsReport") {
      updatedValues = {
        startDueDate: values.startDate,
        endDueDate: values.endDate,
      };
    } else {
      updatedValues = {
        startDate: values.startDate,
        endDate: values.endDate,
      };
    }

    if (!isCompound && values.estate) {
      updatedValues.estate = values.estate.value;
    } else if (isCompound && values.compound) {
      updatedValues.compound = values.compound.value;
    }

    if (values.landlord) {
      updatedValues.landlord = values.landlord;
    }

    if (values.status) {
      updatedValues.status = values.status;
    }

    console.log(updatedValues);

    let endPoint = "income";

    switch (type) {
      case "incomeReport":
        endPoint = "income";
        break;
      case "incomeReportDetails":
        endPoint = "income-details";
        break;
      case "paymentsReport":
        endPoint = "payments";
        break;
      case "contractsReport":
        endPoint = "contracts";
        break;

      default:
        break;
    }

    const printDataValues={
      ...updatedValues
    }
    if (!isCompound && values.estate) {
      printDataValues.estate = values.estate?.label;
    } else if (isCompound && values.compound) {
      printDataValues.compound = values.compound?.label;
    }

    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "add",
        type: `reports/${endPoint}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            if (type === "contractsReport") {
              getSearchData(data.data, printDataValues);
            } else {
              getSearchData(
                data.data?.expenses,
                data.data?.revenues,
                printDataValues
              );
            }
            notifySuccess(key("searchSucc"));
          } else {
            notifyError(key("searchFailed"));
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
    landlord: string().nullable(),
    estate: object()
      .shape({
        label: string(),
        value: string(),
      })
      .nullable(),
    compound: object()
      .shape({
        label: string(),
        value: string(),
      })
      .nullable(),
    startDate: date().required(key("fieldReq")),
    endDate: date()
      .required(key("fieldReq"))
      .test("is-greater", key("endDateValidation"), function (value) {
        const { startDate } = this.parent;
        return value > startDate;
      }),
    status: string().nullable(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            <Col lg={6} className="position-relative">
              <ul
                className={` d-flex flex-column flex-sm-row justify-content-center position-absolute top-0 mt-0 mt-sm-2 z-3 ${
                  isArLang ? styles.ar_icon : styles.en_icon
                } `}
              >
                <li
                  onClick={() => setIsCompound(true)}
                  className={`mx-2 ${
                    isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("estate")}
                </li>
                <li
                  onClick={() => setIsCompound(false)}
                  className={`mx-2 ${
                    !isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCouch}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("unit")}
                </li>
              </ul>
              {!isCompound ? (
                <div className="field mb-1">
                  <label htmlFor="estate">{key("theUnit")}</label>
                  <Select
                    id="estate"
                    name="estate"
                    options={estatesOptions}
                    value={values.estate}
                    onChange={(val) =>
                      setFieldValue("estate", val ? val : null)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    placeholder={isArLang ? "" : "select"}
                    isClearable
                  />
                  <ErrorMessage name="estate" component={InputErrorMessage} />
                </div>
              ) : (
                <div className="field mb-1">
                  <label htmlFor="compound">{key("compound")}</label>
                  <Select
                    id="compound"
                    name="compound"
                    options={compoundsOptions}
                    value={values.compound}
                    onChange={(val) =>
                      setFieldValue("compound", val ? val : null)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    placeholder={isArLang ? "" : "select"}
                    isClearable
                  />
                  <ErrorMessage name="compound" component={InputErrorMessage} />
                </div>
              )}
            </Col>
            <Col lg={6}>
              <div className="field">
                <label htmlFor="landlord">{key("theLandlord")}</label>
                <Select
                  id="landlord"
                  name="landlord"
                  options={landlordOptions}
                  onChange={(val) =>
                    setFieldValue("landlord", val ? val.value : null)
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                  isClearable
                />
                <ErrorMessage name="landlord" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="startDate">
                  {key("startDate")}
                  {requiredLabel}
                </label>
                <Field type="date" id="startDate" name="startDate" />
                <ErrorMessage name="startDate" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="endDate">
                  {key("endDate")}
                  {requiredLabel}
                </label>
                <Field type="date" id="endDate" name="endDate" />
                <ErrorMessage name="endDate" component={InputErrorMessage} />
              </div>
            </Col>

            {type === "paymentsReport" ||
              (type === "contractsReport" && (
                <Col lg={6}>
                  <div className="field">
                    <label htmlFor="status">{key("status")}</label>
                    <Select
                      id="status"
                      name="status"
                      options={
                        type === "contractsReport"
                          ? contractStatusOptions[currentLang]
                          : paymentStatusOptions
                      }
                      onChange={(val) =>
                        setFieldValue("status", val ? val.value : null)
                      }
                      className={`${isArLang ? "text-end" : "text-start"}`}
                      isRtl={isArLang ? false : true}
                      placeholder={isArLang ? "" : "select"}
                      isClearable
                    />
                    <ErrorMessage name="status" component={InputErrorMessage} />
                  </div>
                </Col>
              ))}

            <div className="d-flex  align-items-center mt-3 px-4">
              <CheckPermissions btnActions={[permissionArr]}>
                <button className="submit_btn bg-main" type="submit">
                  {isPending ? (
                    <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                  ) : (
                    key("getReport")
                  )}
                </button>
              </CheckPermissions>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default ReportsForm;
