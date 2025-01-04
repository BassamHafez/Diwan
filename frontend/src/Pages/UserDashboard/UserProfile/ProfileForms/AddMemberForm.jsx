import fetchAccountData from "../../../../Store/accountInfo-actions";
import {
  mainFormsHandlerTypeFormData,
  mainFormsHandlerTypeRaw,
} from "../../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../../shared/index";
import {
  faSpinner,
  toast,
  object,
  string,
  array,
} from "../../../../shared/constants";
import {
  useEffect,
  useState,
  useMutation,
  useQuery,
  useTranslation,
  useSelector,
  useDispatch,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const AddMemberForm = ({ hideModal, allPermissions }) => {
  const [permissionsOptions, setPermissionsOptions] = useState([]);
  const [compoundsOptions, setCompoundsOptions] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const dispatch = useDispatch();

  const requiredLabel = <span className="text-danger">*</span>;
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data: compounds } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: !!token,
  });

  useEffect(() => {
    let compoundOptions = [];
    if (compounds) {
      compoundOptions = compounds?.data?.compounds?.map((compound) => {
        return { label: compound.name, value: compound._id };
      });
    }
    setCompoundsOptions(compoundOptions);
  }, [compounds]);

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
    tag: "",
    email: "",
    phone: "",
    password: "",
    permissions: [],
    permittedCompounds: [],
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = { ...values };

    if (updatedValues.permissions) {
      updatedValues.permissions = updatedValues.permissions.map(
        (perm) => perm.value
      );
    }
    if (updatedValues.permittedCompounds) {
      updatedValues.permittedCompounds = updatedValues.permittedCompounds.map(
        (perm) => perm.value
      );
    }
    console.log(updatedValues);

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "add",
            type: `accounts/${accountInfo?.account?._id}/members`,
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                dispatch(fetchAccountData(token));
                resetForm();
                resolve();
                hideModal();
              } else if (
                data?.response?.data?.message?.split(" ")[0] === "Duplicate"
              ) {
                reject(key("duplicateError"));
              } else {
                reject(key("wrong"));
              }
            },
            onError: (error) => {
              console.log(error);
              if (
                error?.response?.data?.message?.split(" ")[0] === "Duplicate"
              ) {
                reject(key("duplicateError"));
              } else {
                reject(key("wrong"));
              }
            },
          }
        );
      }),
      {
        pending: key(key("saving")),
        success: key("addedSuccess"),
        error: key("duplicateError"),
      }
    );
  };

  const validationSchema = object().shape({
    name: string().required(key("fieldReq")),
    tag: string().required(key("fieldReq")),
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
      .required(key("fieldReq")),
    permittedCompounds: array()
      .of(
        object().shape({
          label: string().required(key("labelReq")),
          value: string().required(key("valueReq")),
        })
      )
      .nullable(),
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
            <Col sm={6}>
              <div className="field">
                <label htmlFor="permissions">
                  {key("permissions")} {requiredLabel}
                </label>
                <Select
                  isClearable
                  options={permissionsOptions}
                  isMulti
                  onChange={(val) => setFieldValue("permissions", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                />
                <ErrorMessage
                  name="permissions"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="permittedCompounds">
                  {key("permittedCompounds")}
                </label>
                <Select
                  isClearable
                  options={compoundsOptions}
                  isMulti
                  onChange={(val) => setFieldValue("permittedCompounds", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                />
                <ErrorMessage
                  name="permittedCompounds"
                  component={InputErrorMessage}
                />
              </div>
            </Col>

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
                <label htmlFor="tag">
                  {key("tag")} {requiredLabel}
                </label>
                <Field
                  type="text"
                  id="tag"
                  name="tag"
                  className={isArLang ? "ar_direction" : ""}
                />
                <ErrorMessage name="tag" component={InputErrorMessage} />
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
