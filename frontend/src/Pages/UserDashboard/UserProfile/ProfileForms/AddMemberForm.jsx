import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { array, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useDispatch, useSelector } from "react-redux";
import fetchAccountData from "../../../../Store/accountInfo-actions";
import CreatableSelect from "react-select/creatable";
import { useEffect, useState } from "react";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";

const AddMemberForm = ({ hideModal, allPermissions }) => {
  const [permissionsOptions, setPermissionsOptions] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const dispatch = useDispatch();

  const requiredLabel = <span className="text-danger">*</span>;
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    if (allPermissions) {
      setPermissionsOptions(
        allPermissions.map((perm) => {
          return { label: key(perm), value: perm };
        })
      );
    }
  }, [allPermissions, key]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    permissions: [],
  };

  const onSubmit = (values, { resetForm }) => {
    if (values.permissions) {
      values.permissions = values.permissions.map((perm) => perm.value);
    }
    console.log(values);
    mutate(
      {
        formData: values,
        token: token,
        method: "add",
        type: `accounts/${accountInfo?.account?._id}/members`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            dispatch(fetchAccountData(token));
            notifySuccess(key("addedSuccess"));
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
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
    phone: string()
      .matches(/^05\d{8}$/, key("invalidPhone"))
      .required(key("fieldReq")),
    password: string()
      .min(5, key("min5"))
      .required(key("fieldReq"))
      .matches(/[A-Z]+/, key("validationUpperCase"))
      .matches(/[a-z]+/, key("validationLowerCase"))
      .matches(/[0-9]+/, key("validationNumber")),
    permissions: array()
      .of(
        object().shape({
          label: string().required(key("labelReq")),
          value: string().required(key("valueReq")),
        })
      )
      .min(1, key("permissionsMin"))
      .required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
        <Form>
          <Row>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="name">
                  {key("name")} {requiredLabel}
                </label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="email">
                  {key("email")} {requiredLabel}
                </label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component={InputErrorMessage} />
              </div>
            </Col>
            <div className="field">
              <label htmlFor="permissions">
                {key("permissions")} {requiredLabel}
              </label>
              <CreatableSelect
                isClearable
                options={permissionsOptions}
                isMulti
                onChange={(val) => setFieldValue("permissions", val)}
                className={`${isArLang ? "text-end" : "text-start"}`}
                isRtl={isArLang ? false : true}
                placeholder={isArLang ? "" : "select"}
              />
              <ErrorMessage name="permissions" component={InputErrorMessage} />
            </div>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="phoneInput">
                  {key("phone")} {requiredLabel}
                </label>
                <Field
                  type="tel"
                  id="phoneInput"
                  name="phone"
                  className={isArLang ? "ar_direction" : ""}
                />
                <ErrorMessage name="phone" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="password">
                  {key("password")} {requiredLabel}
                </label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component={InputErrorMessage} />
              </div>
            </Col>

            <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
              <button onClick={hideModal} className="cancel_btn my-2">
                {key("cancel")}
              </button>

              <button className="submit_btn my-2" type="submit">
                {isPending ? (
                  <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                ) : (
                  key("add")
                )}
              </button>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default AddMemberForm;
