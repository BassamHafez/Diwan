import { useMutation } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";

const UpdateSupport = ({ msgStatus, msgId, refetch, hideModal }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    status: msgStatus || "",
  };

  const onSubmit = (values) => {
    mutate(
      {
        formData: values,
        token: token,
        method: "patch",
        type: `support/messages/${msgId}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            notifySuccess(key("updatedSucc"));
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
    status: string().required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className="d-flex flex-column align-items-start my-4">
          <h4>{key("update")} {key("status")}</h4>
          <div className="btn-group flex-wrap w-100 my-3">
            <Field
              type="radio"
              name="status"
              value="completed"
              id="completed"
              className="btn-check"
            />
            <label
              htmlFor="completed"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("completed")}
            </label>

            <Field
              type="radio"
              name="status"
              value="processing"
              id="processing"
              className="btn-check"
            />
            <label
              htmlFor="processing"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("processing")}
            </label>
            <Field
              type="radio"
              name="status"
              value="pending"
              id="pending"
              className="btn-check"
            />
            <label
              htmlFor="pending"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("pending")}
            </label>
            <Field
              type="radio"
              name="status"
              value="archived"
              id="archived"
              className="btn-check"
            />
            <label
              htmlFor="archived"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("archived")}
            </label>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn bg-main my-2" type="submit">
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

export default UpdateSupport;
