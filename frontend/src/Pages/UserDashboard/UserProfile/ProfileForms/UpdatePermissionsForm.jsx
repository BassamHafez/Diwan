import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { array, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/esm/Row";
import { useDispatch, useSelector } from "react-redux";
import fetchAccountData from "../../../../Store/accountInfo-actions";
import CreatableSelect from "react-select/creatable";
import { useEffect, useState } from "react";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";

const UpdatePermissionsForm = ({
  hideModal,
  allPermissions,
  userPermissions,
}) => {
  const [permissionsOptions, setPermissionsOptions] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const dispatch = useDispatch();
  const profileInfo = useSelector((state) => state.profileInfo.data);
 
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
    permissions:
      userPermissions?.map((perm) => {
        return { label: key(perm), value: perm };
      }) || [],
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
        method: "patch",
        type: `accounts/${accountInfo?.account?._id}/members/${profileInfo?._id}`,
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
      enableReinitialize
    >
      {({ setFieldValue,values }) => (
        <Form>
          <Row>
            <div className="field">
              <label htmlFor="permissions">{key("permissions")}</label>
              <CreatableSelect
                isClearable
                options={permissionsOptions}
                isMulti
                onChange={(val) => setFieldValue("permissions", val)}
                value={values.permissions}
                className={`${isArLang ? "text-end" : "text-start"}`}
                isRtl={isArLang ? false : true}
                placeholder={isArLang ? "" : "select"}
              />
              <ErrorMessage name="permissions" component={InputErrorMessage} />
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
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePermissionsForm;
