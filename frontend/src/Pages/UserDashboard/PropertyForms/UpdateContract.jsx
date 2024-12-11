import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, number, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { unitOptions } from "../../../Components/Logic/StaticLists";
import {
  calculateDaysDifference,
  calculateRevenues,
  filterTimeUnitDpendsOnDaysDifference,
  formattedDate,
  generatePeriodOptions,
} from "../../../Components/Logic/LogicFun";
import ContractRevenues from "../PropertyDetails/ContractRevenues";
import MainModal from "../../../Components/UI/Modals/MainModal";

const UpdateContract = ({ contract, hideModal, refetch }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [paymentPeriodUnit, setPaymentPeriodUnit] = useState(
    contract.paymentPeriodUnit || ""
  );
  const [paymentPeriodValueOptions, setPaymentPeriodValueOptions] = useState(
    []
  );
  const [paymentPeriodUnitOptions, setPaymentPeriodUnitOptions] = useState([]);
  const [startDate, setStartDate] = useState(
    formattedDate(contract.startDate) || ""
  );
  const [endDate, setEndDate] = useState(formattedDate(contract.endDate) || "");
  const [revenues, setRevenues] = useState([]);
  const [showRevenuesTable, setShowRevenuesTable] = useState(false);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  const { propId } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (startDate && endDate) {
      const daysDifference = calculateDaysDifference(startDate, endDate);

      const filteredUnits = filterTimeUnitDpendsOnDaysDifference(
        unitOptions,
        daysDifference,
        isArLang
      );

      setPaymentPeriodUnitOptions(filteredUnits);

      if (!filteredUnits.some((unit) => unit.value === paymentPeriodUnit)) {
        setPaymentPeriodUnit("");
        setPaymentPeriodValueOptions([]);
      }
    }
  }, [startDate, endDate, isArLang, paymentPeriodUnit]);

  useEffect(() => {
    if (paymentPeriodUnit && startDate && endDate) {
      const daysDifference = calculateDaysDifference(startDate, endDate);

      setPaymentPeriodValueOptions(
        generatePeriodOptions(
          paymentPeriodUnit,
          daysDifference,
          key(paymentPeriodUnit),
          key(`plural${paymentPeriodUnit}`),
          key("every")
        )
      );
    }
  }, [paymentPeriodUnit, startDate, endDate, key]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    tenant: contract.tenant?.name || "",
    startDate: formattedDate(contract.startDate) || "",
    endDate: formattedDate(contract.endDate) || "",
    totalAmount: contract.totalAmount || "",
    paymentPeriodValue: contract.paymentPeriodValue || "",
    paymentPeriodUnit: contract.paymentPeriodUnit || "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    const updatedValues = {
      startDate: values.startDate,
      endDate: values.endDate,
      totalAmount: values.totalAmount,
      paymentPeriodValue: values.paymentPeriodValue,
      paymentPeriodUnit: values.paymentPeriodUnit,
    };
    console.log(updatedValues);
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "patch",
        type: `estates/${propId}/contracts/${contract._id}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (
            data.response?.data?.message ===
            "There is an contract overlapping with the selected dates"
          ) {
            notifyError(key("contractOverlapping"));
            return;
          }
          if (data?.status === "success") {
            notifySuccess(key("updatedSucc"));
            refetch();
            queryClient.invalidateQueries(["revenuesData", token]);
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
    tenant: string().required(key("fieldReq")),
    startDate: date()
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
    endDate: date()
      .required(key("fieldReq"))
      .test("is-greater", key("endDateValidation"), function (value) {
        const { startDate } = this.parent;
        return value > startDate;
      }),
    totalAmount: number().required(key("fieldReq")),
    paymentPeriodValue: string().required(key("fieldReq")),
    paymentPeriodUnit: string().required(key("fieldReq")),
  });

  const showCalculatedRevenues = (values) => {
    console.log(values);
    const {
      totalAmount,
      paymentPeriodValue,
      paymentPeriodUnit,
      startDate,
      endDate,
    } = values;

    if (
      totalAmount &&
      paymentPeriodValue &&
      paymentPeriodUnit &&
      startDate &&
      endDate
    ) {
      const myRevenues =
        calculateRevenues(
          Number(totalAmount),
          Number(paymentPeriodValue),
          paymentPeriodUnit,
          startDate,
          endDate
        ) || [];
      setRevenues(myRevenues);
      setShowRevenuesTable(true);
    } else {
      notifyError("fillReq");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Row>
              <Col sm={12}>
                <div className="d-flex justify-content-end align-items-center mb-3">
                  <button
                    className="submit_btn bg-navy mx-2"
                    type="button"
                    onClick={() => showCalculatedRevenues(values)}
                    disabled={
                      !values.startDate ||
                      !values.endDate ||
                      !values.totalAmount ||
                      !values.paymentPeriodValue ||
                      !values.paymentPeriodUnit
                    }
                  >
                    {key("showRevenues")}
                  </button>
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="tenant">{key("theTenant")}</label>
                  <Field
                    type="text"
                    id="tenant"
                    name="tenant"
                    disabled={true}
                  />
                  <ErrorMessage name="tenant" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="totalAmount">
                    {key("price")}
                    {requiredLabel} ({key("sar")})
                  </label>
                  <Field type="number" id="totalAmount" name="totalAmount" />
                  <ErrorMessage
                    name="totalAmount"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>

              <Col sm={6}>
                <div className="field">
                  <label htmlFor="startDate">
                    {key("startContract")}
                    {requiredLabel}
                  </label>
                  <Field
                    type="date"
                    id="startDate"
                    name="startDate"
                    onChange={(e) => {
                      setFieldValue("startDate", e.target.value);
                      setStartDate(e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name="startDate"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="endDate">
                    {key("endContract")}
                    {requiredLabel}
                  </label>
                  <Field
                    type="date"
                    id="endDate"
                    name="endDate"
                    onChange={(e) => {
                      setFieldValue("endDate", e.target.value);
                      setEndDate(e.target.value);
                    }}
                  />
                  <ErrorMessage name="endDate" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="paymentPeriodUnit">
                    {key("timeUnit")}
                    {requiredLabel}
                  </label>
                  <Select
                    id="paymentPeriodUnit"
                    name="paymentPeriodUnit"
                    options={paymentPeriodUnitOptions}
                    onChange={(val) => {
                      setFieldValue("paymentPeriodUnit", val.value);
                      setPaymentPeriodUnit(val.value);
                    }}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    isDisabled={!startDate || !endDate}
                    placeholder={`${
                      paymentPeriodUnitOptions.find(
                        (unit) => unit.value === values.paymentPeriodUnit
                      )?.label || ""
                    }`}
                  />
                  <ErrorMessage
                    name="paymentPeriodUnit"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="endDate">
                    {key("paymentPeriodValue")}
                    {requiredLabel}
                  </label>
                  <Select
                    id="paymentPeriodValue"
                    name="paymentPeriodValue"
                    options={paymentPeriodValueOptions}
                    onChange={(val) =>
                      setFieldValue("paymentPeriodValue", val.value)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    isDisabled={!paymentPeriodUnit}
                    placeholder={`${
                      paymentPeriodValueOptions.find(
                        (unit) => unit.value === values.paymentPeriodValue
                      )?.label || ""
                    }`}
                  />
                  <ErrorMessage
                    name="paymentPeriodValue"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
              <button onClick={hideModal} className="cancel_btn my-2">
                {key("cancel")}
              </button>

              <button className="submit_btn bg-main my-2" type="submit">
                {isPending ? (
                  <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                ) : (
                  `${key("update")}`
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <MainModal
        show={showRevenuesTable}
        onHide={() => setShowRevenuesTable(false)}
        cancelBtn={key("confirm")}
        modalSize={"lg"}
      >
        <ContractRevenues revenues={revenues} />
      </MainModal>
    </>
  );
};

export default UpdateContract;
