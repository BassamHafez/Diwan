import { mainFormsHandlerTypeRaw } from "../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../shared/index";
import { faSpinner, toast, object, number } from "../../../shared/constants";
import { useMutation, useTranslation } from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";

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
    price: number().min(0, key("positiveValidation")).required(key("fieldReq")),
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
