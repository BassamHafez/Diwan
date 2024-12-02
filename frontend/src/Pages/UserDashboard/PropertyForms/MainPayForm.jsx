import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { paymentMethodOptions } from "../../../Components/Logic/StaticLists";
import { formattedDate } from "../../../Components/Logic/LogicFun";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";

const MainPayForm = ({ hideModal, refetch, type,Id }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const param = useParams();
  
  const endPoint= type==="rev"?`estates/${param.propId}/revenues/${Id}/pay`:`expenses/${Id}/pay`

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    paymentMethod: "",
    paidAt: `${formattedDate(new Date())}`,
  };

  const onSubmit = (values, { resetForm }) => {
    mutate(
      {
        formData: values,
        token: token,
        method: "patch",
        type: endPoint,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            notifySuccess(key("paidSucc"));
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
    paymentMethod: string().required(key("fieldReq")),
    paidAt: date(),
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
          <div className="field mb-1">
            <label htmlFor="paymentMethod">
              {key("paymentMethod")} {requiredLabel}
            </label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              options={
                isArLang
                  ? paymentMethodOptions["ar"]
                  : paymentMethodOptions["en"]
              }
              onChange={(val) => setFieldValue("paymentMethod", val.value)}
              className={`${isArLang ? "text-end" : "text-start"}`}
              isRtl={isArLang ? false : true}
              placeholder=""
            />
            <ErrorMessage name="paymentMethod" component={InputErrorMessage} />
          </div>
          <div className="field">
            <label htmlFor="paidAt">
              {key("paidAt")} {requiredLabel}
            </label>
            <Field type="date" id="paidAt" name="paidAt" />
            <ErrorMessage name="paidAt" component={InputErrorMessage} />
          </div>

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
      )}
    </Formik>
  );
};

export default MainPayForm;
