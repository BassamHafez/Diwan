import styles from "./PropertyForms.module.css";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
  CreatableSelect,
} from "../../../shared/index";
import {
  faImage,
  faSpinner,
  toast,
  number,
  object,
  string,
} from "../../../shared/constants";
import {
  useState,
  useMutation,
  useTranslation,
  useDispatch,
  useFileHandler,
  useContactsOptions,
  useTagsOption,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import {
  citiesByRegion,
  citiesByRegionAr,
  districtsByCity,
  districtsByCityAr,
  SaudiRegion,
  SaudiRegionAr,
} from "../../../Components/Logic/StaticLists";
import fetchAccountData from "../../../Store/accountInfo-actions";

const AddCompound = ({ hideModal, refetch }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const { tagsOptions, refetchTags } = useTagsOption();
  const { brokersOptions, landlordOptions } = useContactsOptions();

  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  const dispatch = useDispatch();
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    name: "",
    description: "",
    region: "",
    city: "",
    neighborhood: "",
    address: "",
    tags: [],
    broker: "",
    commissionPercentage: 0,
    landlord: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("city", values.city);
    formData.append("region", values.region);

    if (values.address) {
      formData.append("address", values.address);
    }
    formData.append("neighborhood", values.neighborhood);
    if (values.landlord) {
      formData.append("landlord", values.landlord);
    }
    if (values.broker) {
      formData.append("broker", values.broker);
      formData.append("commissionPercentage", values.commissionPercentage || 0);
    }
    const isTagsExist = values.tags?.length > 0;
    if (isTagsExist) {
      values.tags.forEach((obj, index) => {
        formData.append(`tags[${index}]`, obj.value);
      });
    }

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "add",
            type: "compounds",
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (data?.status === "success") {
                await refetch();
                dispatch(fetchAccountData(token));
                if (isTagsExist) {
                  refetchTags();
                }
                resolve();
                resetForm();
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
        success: key("addedSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    name: string().required(key("fieldReq")),
    description: string()
      .min(5, key("descValidation"))
      .required(key("fieldReq")),
    city: string().required(key("fieldReq")),
    region: string().required(key("fieldReq")),
    neighborhood: string().required(key("fieldReq")),
    address: string(),
    lessor: string(),
    broker: string(),
    commissionPercentage: number().min(0, key("positiveValidation")),
  });

  const handleRegionChange = (selectedRegion, setFieldValue) => {
    setFieldValue("region", selectedRegion?.value || "");
    setFieldValue("city", "");
    setFieldValue("neighborhood", "");
    let cities;
    if (isArLang) {
      cities = citiesByRegionAr[selectedRegion?.value] || [];
    } else {
      cities = citiesByRegion[selectedRegion?.value] || [];
    }

    setCityOptions(cities);
    setDistrictOptions([]);
  };

  const handleCityChange = (selectedCity, setFieldValue) => {
    setFieldValue("city", selectedCity?.value || "");
    setFieldValue("neighborhood", "");
    let districts;
    if (isArLang) {
      districts = districtsByCityAr[selectedCity?.value] || [];
    } else {
      districts = districtsByCity[selectedCity?.value] || [];
    }
    let finalDistricts = [
      { label: key("notSpecified"), value: "not specified" },
      ...districts,
    ];
    setDistrictOptions(finalDistricts);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="name">
                  {key("name")} {requiredLabel}
                </label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="region">
                  {key("region")} {requiredLabel}
                </label>
                <Select
                  id="region"
                  name="region"
                  options={isArLang ? SaudiRegionAr : SaudiRegion}
                  onChange={(selected) =>
                    handleRegionChange(selected, setFieldValue)
                  }
                  value={
                    (isArLang ? SaudiRegionAr : SaudiRegion).find(
                      (opt) => opt.value === values.region
                    ) || null
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="region" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label>
                  {key("city")} {requiredLabel}
                </label>
                <Select
                  options={cityOptions}
                  onChange={(selected) =>
                    handleCityChange(selected, setFieldValue)
                  }
                  value={
                    cityOptions.find((opt) => opt.value === values.city) || null
                  }
                  isDisabled={!values.region}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="city" component="div" className="error" />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label>{key("district")}</label>
                <Select
                  options={districtOptions}
                  onChange={(selected) =>
                    setFieldValue("neighborhood", selected?.value)
                  }
                  value={
                    districtOptions.find(
                      (opt) => opt.value === values.neighborhood
                    ) || null
                  }
                  isDisabled={!values.city}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage
                  name="neighborhood"
                  component="div"
                  className="error"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="address">{key("address")}</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component={InputErrorMessage} />
              </div>
              <div className="field mb-1">
                <label htmlFor="tags">{key("searchKeys")}</label>
                <CreatableSelect
                  isClearable
                  options={tagsOptions}
                  isMulti
                  onChange={(val) => setFieldValue("tags", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                  formatCreateLabel={(inputValue) =>
                    isArLang ? `إضافة "${inputValue}"` : `Add "${inputValue}"`
                  }
                />
                <ErrorMessage name="tags" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="description">
                  {key("description")} {requiredLabel}
                </label>
                <Field
                  className="text_area"
                  as="textarea"
                  id="description"
                  name="description"
                />
                <ErrorMessage
                  name="description"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="broker">{key("agent")}</label>
                <Select
                  id="broker"
                  name="broker"
                  options={brokersOptions}
                  onChange={(val) => setFieldValue("broker", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="broker" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="landlord">{key("theLandlord")}</label>
                <Select
                  id="landlord"
                  name="landlord"
                  options={landlordOptions}
                  onChange={(val) => setFieldValue("landlord", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="landlord" component={InputErrorMessage} />
              </div>
            </Col>
            {values.broker && (
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="commissionPercentage">
                    {key("commissionPercentage")} (%)
                  </label>
                  <Field
                    type="number"
                    id="commissionPercentage"
                    name="commissionPercentage"
                  />
                  <ErrorMessage
                    name="commissionPercentage"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
            )}
            <Col sm={12}>
              <div className={styles.photo_field}>
                <h6 className="mb-3">{key("compoundImage")}</h6>
                <label
                  className={
                    imagePreviewUrl
                      ? styles.photo_label_img
                      : styles.photo_label
                  }
                  htmlFor="compoundImage"
                >
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Uploaded_image"
                      className={styles.image_preview}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className={styles.img_icon}
                      icon={faImage}
                    />
                  )}
                </label>
                <input
                  type="file"
                  id="compoundImage"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="d-none"
                />
                <ErrorMessage name="image" component={InputErrorMessage} />
              </div>
            </Col>
          </Row>

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
        </Form>
      )}
    </Formik>
  );
};

export default AddCompound;
