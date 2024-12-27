import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { number, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import Select from "react-select";
import { maxEstatesInCompoundOriginalOptions } from "../../../../Components/Logic/StaticLists";

const CreatePackage = ({ refetch, hideModal }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    arTitle: "",
    enTitle: "",
    price: "",
    originalPrice: "",
    isBestOffer: false,
    isMostPopular: false,
    usersCount: "",
    compoundsCount: "",
    estatesCount: "",
    maxEstatesInCompound: "",
    isFavoriteAllowed: false,
    isRemindersAllowed: false,
  };

  const onSubmit = (values, { resetForm }) => {
    const featuresArr = [
      { label: "allowedUsers", value: `${values.usersCount || 0}` },
      { label: "allowedCompounds", value: `${values.compoundsCount || 0}` },
      { label: "allowedEstates", value: `${values.estatesCount || 0}` },
      {
        label: "maxEstatesInCompound",
        value: `${values.maxEstatesInCompound?.value || 0}`,
      },
      {
        label: "isFavoriteAllowed",
        value: `${values.isFavoriteAllowed || false}`,
      },
      {
        label: "isRemindersAllowed",
        value: `${values.isRemindersAllowed || false}`,
      },
    ];

    const updatedValues = {
      arTitle: values.arTitle,
      enTitle: values.enTitle,
      price: values.price,
      originalPrice: values.originalPrice,
      isBestOffer: values.isBestOffer,
      isMostPopular: values.isMostPopular,
      features: featuresArr,
    };

    console.log(updatedValues);
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "add",
        type: `packages`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            if (refetch) {
              refetch();
            }
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

  const validationSchema = object({
    arTitle: string().required(key("fieldReq")),
    enTitle: string().required(key("fieldReq")),
    price: number().required(key("fieldReq")),
    originalPrice: number().required(key("fieldReq")),
    usersCount: number(),
    compoundsCount: number(),
    estatesCount: number(),
    maxEstatesInCompound: object()
      .shape({
        label: string(),
        value: number(),
      })
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
                <label htmlFor="arTitle">
                  {key("arTitle")} {requiredLabel}
                </label>
                <Field type="text" id="arTitle" name="arTitle" />
                <ErrorMessage name="arTitle" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="enTitle">
                  {key("enTitle")} {requiredLabel}
                </label>
                <Field type="text" id="enTitle" name="enTitle" />
                <ErrorMessage name="enTitle" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="price">
                  {key("newPrice")} {requiredLabel}
                </label>
                <Field type="number" id="price" name="price" />
                <ErrorMessage name="price" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="originalPrice">
                  {key("oldPrice")} {requiredLabel}
                </label>
                <Field type="number" id="originalPrice" name="originalPrice" />
                <ErrorMessage
                  name="originalPrice"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="usersCount">{key("usersCount")}</label>
                <Field type="number" id="usersCount" name="usersCount" />
                <ErrorMessage name="usersCount" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="compoundsCount">{key("compoundsCount")}</label>
                <Field
                  type="number"
                  id="compoundsCount"
                  name="compoundsCount"
                />
                <ErrorMessage
                  name="compoundsCount"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="estatesCount">{key("estatesCount")}</label>
                <Field type="number" id="estatesCount" name="estatesCount" />
                <ErrorMessage
                  name="estatesCount"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="maxEstatesInCompound">
                  {key("maxEstatesInCompound")}
                </label>
                <Select
                  options={maxEstatesInCompoundOriginalOptions}
                  onChange={(val) =>
                    setFieldValue("maxEstatesInCompound", val ? val : null)
                  }
                  className={`${isArLang ? "text-end" : "text-start"} my-3`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                />
                <ErrorMessage
                  name="maxEstatesInCompound"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col
              sm={12}
              className="d-flex align-items-center justify-content-between flex-wrap"
            >
              <div>
                <Field
                  name="isFavoriteAllowed"
                  type="checkbox"
                  id="isFavoriteAllowed"
                  className=" fs-5 m-0"
                  style={{ cursor: "pointer" }}
                />
                <label className=" m-0 mx-2" htmlFor="isFavoriteAllowed">
                  {key("add")} {key("bookmarked")}
                </label>
              </div>
              <div>
                <Field
                  name="isRemindersAllowed"
                  type="checkbox"
                  id="isRemindersAllowed"
                  className=" fs-5 m-0"
                  style={{ cursor: "pointer" }}
                />
                <label className=" m-0 mx-2" htmlFor="isRemindersAllowed">
                  {key("isRemindersAllowed")}
                </label>
              </div>

              <div>
                <Field
                  name="isMostPopular"
                  type="checkbox"
                  id="isMostPopular"
                  style={{ cursor: "pointer" }}
                />
                <label className=" m-0 mx-2" htmlFor="isMostPopular">
                  {key("isMostPopular")}
                </label>
              </div>

              <div>
                <Field
                  name="isBestOffer"
                  type="checkbox"
                  id="isBestOffer"
                  style={{ cursor: "pointer" }}
                />
                <label className="m-0 mx-2" htmlFor="isBestOffer">
                  {key("isBestOffer")}
                </label>
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

export default CreatePackage;
