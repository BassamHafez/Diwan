import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { number, object } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";

const UpdateSubscriptions = ({ hideModal, refetch, sub }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    price: Number(sub.price) || 0,
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      [sub.feature]: values.price,
    };

    console.log(updatedValues);
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "put",
        type: `subscriptions`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            if (refetch) {
              refetch();
            }
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
    price: number().required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className="field">
          <label htmlFor="price">
            {key(sub.feature)} {requiredLabel}
          </label>
          <Field type="text" id="price" name="price" />
          <ErrorMessage name="price" component={InputErrorMessage} />
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
      </Form>
    </Formik>
  );
};

export default UpdateSubscriptions;
