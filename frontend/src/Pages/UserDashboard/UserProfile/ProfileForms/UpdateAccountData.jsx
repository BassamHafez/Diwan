import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import { useDispatch } from "react-redux";
import fetchAccountData from "../../../../Store/accountInfo-actions";

const UpdateAccountData = ({ accountInfo, hideModal }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();

  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: accountInfo.name || "",
    phone: accountInfo.phone || "",
    address: accountInfo.address || "",
    commercialRecord: accountInfo.commercialRecord || "",
    taxNumber: accountInfo.taxNumber || "",
  };

  const onSubmit = (values, { resetForm }) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== "" && value !== undefined
      )
    );

    mutate(
      {
        formData: filteredValues,
        token: token,
        method: "patch",
        type: `accounts/${accountInfo?.account?._id}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            dispatch(fetchAccountData(token));
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

  const validationSchema = object().shape({
    name: string().required(key("fieldReq")),
    address: string().required(key("fieldReq")),
    phone: string()
      .matches(/^05\d{8}$/, key("invalidPhone"))
      .required(key("fieldReq")),
    commercialRecord: string().matches(/^\d{10}$/, key("CommercialValidation")),
    taxNumber: string().matches(/^3\d{14}$/, key("taxNumberValidation")),
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
          <label htmlFor="name">
            {key("name")} {requiredLabel}
          </label>
          <Field type="text" id="name" name="name" />
          <ErrorMessage name="name" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="phoneInput">
            {key("phone")} {requiredLabel}
          </label>
          <Field
            type="tel"
            id="phoneInput"
            name="phone"
            placeholder="05XXXXXXXX"
          />
          <ErrorMessage name="phone" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="address">
            {key("address")} {requiredLabel}
          </label>
          <Field type="address" id="address" name="address" />
          <ErrorMessage name="address" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="commercialRecord">
            {key("commercialRecord")} {requiredLabel}
          </label>
          <Field
            type="number"
            placeholder="XXXXXXXXXX"
            id="commercialRecord"
            name="commercialRecord"
          />
          <ErrorMessage name="commercialRecord" component={InputErrorMessage} />
        </div>
        <div className="field">
          <label htmlFor="taxNumber">
            {key("taxNumber")} {requiredLabel}
          </label>
          <Field
            type="number"
            placeholder="3XXXXXXXXXXXXXX"
            id="taxNumber"
            name="taxNumber"
          />
          <ErrorMessage name="taxNumber" component={InputErrorMessage} />
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

export default UpdateAccountData;
