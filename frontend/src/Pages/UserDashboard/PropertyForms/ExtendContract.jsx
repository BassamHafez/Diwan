import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, object } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import {formattedDate } from "../../../Components/Logic/LogicFun";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const ExtendContract = ({
  hideModal,
  refetch,
  refetchDetails,
  contractDetails,
}) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  const { propId } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    endContract: formattedDate(contractDetails?.endDate) || "",
    newEndDate: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      endDate: values.newEndDate,
    };

    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "put",
        type: `estates/${propId}/contracts/${contractDetails?._id}/extend`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            refetchDetails();
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
    endContract: date(),
    newEndDate: date()
      .test(
        "is-present-or-future",
        key("startDateValidation"),
        function (value) {
          if (!value) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(value) >= today;
        }
      )
      .required(key("fieldReq"))
      .test("is-greater", key("endDateValidation2"), function (value) {
        const { endContract } = this.parent;
        return value > endContract;
      }),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <Row>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="endContract">{key("endContract")}</label>
              <Field type="date" id="endContract" name="endContract" disabled />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="newEndDate">
                {key("newEndDate")} {requiredLabel}
              </label>
              <Field type="date" id="newEndDate" name="newEndDate" />
              <ErrorMessage name="newEndDate" component={InputErrorMessage} />
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
              key("update")
            )}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default ExtendContract;
