import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { array, date, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import CheckPermissions from "../../../../Components/CheckPermissions/CheckPermissions";
import { cleanUpData } from "../../../../Components/Logic/LogicFun";

const CompoundsReportForm = ({
  compoundsOptions,
  landlordOptions,
  getSearchData,
  type,
}) => {
  const { t: key } = useTranslation();

  const token = JSON.parse(localStorage.getItem("token"));
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const requiredLabel = <span className="text-danger">*</span>;
  const isDetails = type === "compoundDetailsReport";

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const myInitalValues = isDetails
    ? { compoundId: "", startDate: "", endDate: "" }
    : { landlord: "", compoundsIds: [], startDate: "", endDate: "" };

  const initialValues = myInitalValues;

  const onSubmit = (values) => {
    let updatedValues = { ...values };

    if (updatedValues.compoundsIds) {
      updatedValues.compoundsIds = updatedValues.compoundsIds.map(
        (comp) => comp.value
      );
    }

    if (updatedValues.compoundId) {
      updatedValues.compoundId = updatedValues.compoundId.value;
    }

    const cleanedValues =cleanUpData(updatedValues)

    const endPoint = isDetails ? "compound-details" : "compounds";

    const printDataValues = { ...updatedValues };
    if (printDataValues.compoundId) {
      printDataValues.compoundId = printDataValues.compoundId.label;
    }
    mutate(
      {
        formData: cleanedValues,
        token: token,
        method: "add",
        type: `reports/${endPoint}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            if (isDetails) {
              getSearchData(data?.data, printDataValues);
            } else {
              getSearchData(
                data.data?.expenses,
                data.data?.revenues,
                updatedValues
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
  const myValidationSchema = isDetails
    ? object({
        compoundId: object()
          .shape({
            label: string(),
            value: string(),
          })
          .required(key("fieldReq")),
        startDate: date().required(key("fieldReq")),
        endDate: date()
          .required(key("fieldReq"))
          .test("is-greater", key("endDateValidation"), function (value) {
            const { startDate } = this.parent;
            return value > startDate;
          }),
      })
    : object({
        landlord: string().nullable(),
        compoundsIds: array()
          .of(
            object().shape({
              label: string().required(key("labelReq")),
              value: string().required(key("valueReq")),
            })
          )
          .nullable(),
        startDate: date().required(key("fieldReq")),
        endDate: date()
          .required(key("fieldReq"))
          .test("is-greater", key("endDateValidation"), function (value) {
            const { startDate } = this.parent;
            return value > startDate;
          }),
      });

  const validationSchema = myValidationSchema;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
        <Form>
          <Row>
            <Col sm={isDetails ? 12 : 6}>
              {isDetails ? (
                <div className="field">
                  <label htmlFor="compoundId">{key("compound")} {requiredLabel}</label>
                  <Select
                    isClearable
                    options={compoundsOptions}
                    onChange={(val) => setFieldValue("compoundId", val)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder=""
                  />
                  <ErrorMessage
                    name="compoundId"
                    component={InputErrorMessage}
                  />
                </div>
              ) : (
                <div className="field">
                  <label htmlFor="compoundsIds">{key("compounds")}</label>
                  <Select
                    isClearable
                    options={compoundsOptions}
                    isMulti
                    onChange={(val) => setFieldValue("compoundsIds", val)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder=""
                  />
                  <ErrorMessage
                    name="compoundsIds"
                    component={InputErrorMessage}
                  />
                </div>
              )}
            </Col>
            {!isDetails && (
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
                    isRtl={isArLang ? true : false}
                    placeholder=""
                    isClearable
                  />
                  <ErrorMessage name="landlord" component={InputErrorMessage} />
                </div>
              </Col>
            )}
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

            <div className="d-flex  align-items-center mt-3 px-4">
              <CheckPermissions btnActions={["COMPOUNDS_REPORTS"]}>
                <button className="submit_btn" type="submit">
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

export default CompoundsReportForm;
