import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, number, object, string } from "yup";
import { faCoins, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { cleanUpData, formattedDate } from "../../../Components/Logic/LogicFun";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const SplitRevenue = ({
  hideModal,
  refetch,
  refetchDetails,
  revenueDetails,
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
    splitedAmount: "",
    dueDate: `${formattedDate(revenueDetails?.dueDate)}`,
    note: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const cleanedValues = cleanUpData({ ...values });
    console.log(cleanedValues);

    mutate(
      {
        formData: cleanedValues,
        token: token,
        method: "put",
        type: `estates/${propId}/revenues/${revenueDetails?._id}/split`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            refetchDetails();
            notifySuccess(key("splitedSucc"));
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
    splitedAmount: number().required(key("fieldReq")),
    dueDate: date().required(key("fieldReq")),
    note: string().min(5, key("min5")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className="d-flex px-2">
          <span className="mb-4 text-secondary">
            <FontAwesomeIcon className="text-warning" icon={faCoins} />{" "}
            {key("totallyAmount")} ({revenueDetails?.amount}) {key("sarSmall")}
          </span>
        </div>

        <Row>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="splitedAmount">
                {key("splitedAmount")} ({key("sarSmall")}) {requiredLabel}
              </label>
              <Field type="number" id="splitedAmount" name="splitedAmount" />
              <ErrorMessage
                name="splitedAmount"
                component={InputErrorMessage}
              />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="dueDate">
                {key("dueDate")} {requiredLabel}
              </label>
              <Field type="date" id="dueDate" name="dueDate" />
              <ErrorMessage name="dueDate" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={12}>
            <div className="field">
              <label htmlFor="note">{key("notes")}</label>
              <Field
                as="textarea"
                className="text_area"
                id="note"
                name="note"
              />
              <ErrorMessage name="note" component={InputErrorMessage} />
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
              key("confirm")
            )}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default SplitRevenue;
