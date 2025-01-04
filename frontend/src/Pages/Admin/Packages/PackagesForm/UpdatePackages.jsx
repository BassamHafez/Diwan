import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import {
  maxEstatesInCompoundOriginalOptions,
  packagesDuration,
} from "../../../../Components/Logic/StaticLists";

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
  number,
} from "../../../../shared/constants";
import { useMutation, useTranslation } from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const UpdatePackages = ({ pack, refetch, hideModal }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";

  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const findFeaturesValue = (labelName) => {
    const featureObj = pack?.features?.find(
      (feature) =>
        feature.label.trim().toLowerCase() === labelName.trim().toLowerCase()
    );
    return featureObj?.value;
  };

  const initialValues = {
    arTitle: pack.arTitle || "",
    enTitle: pack.enTitle || "",
    price: pack.price || 0,
    originalPrice: pack.originalPrice || 0,
    isBestOffer: pack.isBestOffer || false,
    isMostPopular: pack.isMostPopular || false,
    duration: packagesDuration[currentLang]?.find(
      (item) => item.value === pack?.duration
    ),
    usersCount:
      Number(findFeaturesValue("allowedUsers").toLowerCase().trim()) || 0,
    compoundsCount:
      Number(findFeaturesValue("allowedCompounds").trim().toLowerCase()) || 0,
    estatesCount: Number(findFeaturesValue("allowedEstates")) || 0,
    maxEstatesInCompound: {
      label: findFeaturesValue("maxEstatesInCompound"),
      value: Number(findFeaturesValue("maxEstatesInCompound")) || 0,
    },
    isFavoriteAllowed:
      findFeaturesValue("isFavoriteAllowed") === "true" || false,
    isRemindersAllowed:
      findFeaturesValue("isRemindersAllowed") === "true" || false,
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
      duration: values.duration?.value,
      originalPrice: values.originalPrice,
      isBestOffer: values.isBestOffer,
      isMostPopular: values.isMostPopular,
      features: featuresArr,
    };

    console.log(updatedValues);

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "patch",
            type: `packages/${pack._id}`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (data?.status === "success") {
                await refetch();
                resetForm();
                resolve();
                hideModal();
              } else {
                reject();
              }
            },
            onError: (error) => {
              console.log(error);
              reject();
            },
          }
        );
      }),
      {
        pending: key(key("saving")),
        success: key("updatedSucc"),
        error: key("wrong"),
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
    duration: object()
      .shape({
        label: string(),
        value: number(),
      })
      .required(key("fieldReq")),
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
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
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
                <label htmlFor="maxEstatesInCompound">
                  {key("maxEstatesInCompound")}
                </label>
                <Select
                  id="maxEstatesInCompound"
                  options={maxEstatesInCompoundOriginalOptions}
                  value={values.maxEstatesInCompound}
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
            <Col sm={6}>
              <div className="field">
                <label htmlFor="packDuration">{key("packDuration")}</label>
                <Select
                  options={packagesDuration[currentLang]}
                  value={values.duration}
                  onChange={(val) =>
                    setFieldValue("duration", val ? val : null)
                  }
                  className={`${isArLang ? "text-end" : "text-start"} my-3`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                  id="packDuration"
                />
                <ErrorMessage name="duration" component={InputErrorMessage} />
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

export default UpdatePackages;
