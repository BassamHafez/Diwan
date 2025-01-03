import { useEffect, useState } from "react";
import styles from "./PropertyForms.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faImage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  mainFormsHandlerTypeFormData,
  mainFormsHandlerTypeRaw,
} from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Select from "react-select";
import {
  citiesByRegion,
  citiesByRegionAr,
  districtsByCity,
  districtsByCityAr,
  maxFileSize,
  SaudiRegion,
  SaudiRegionAr,
} from "../../../Components/Logic/StaticLists";
import CreatableSelect from "react-select/creatable";
import fetchAccountData from "../../../Store/accountInfo-actions";
import { useDispatch } from "react-redux";

const AddEstate = ({ hideModal, refetch, compId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [compoundsOptions, setCompoundsOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const dispatch = useDispatch();

  const { data: compounds } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    let compoundOptions = [];
    if (compounds) {
      compoundOptions = compounds?.data?.compounds?.map((compound) => {
        return { label: compound.name, value: compound._id };
      });
    }
    let allCompoundsOptions = [
      { label: key("notSpecified"), value: "not" },
      ...compoundOptions,
    ];
    setCompoundsOptions(allCompoundsOptions);
  }, [compounds, key]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const { data: tags } = useQuery({
    queryKey: ["tags", token],
    queryFn: () => mainFormsHandlerTypeRaw({ token: token, type: "tags" }),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    const myTagsOptions = tags?.data?.map((tag) => {
      return { label: tag, value: tag };
    });
    setTagsOptions(myTagsOptions);
  }, [tags]);

  const initialValues = {
    image: "",
    compound: compId || "",
    name: "",
    description: "",
    region: "",
    city: "",
    neighborhood: "",
    address: "",
    tags: [],
    price: "",
    area: "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    const formData = new FormData();

    if (values.compound) {
      if (values.compound !== "not") {
        formData.append("compound", values.compound);
      }
    }

    if (values.compound === "not") {
      if (!values.region) {
        notifyError(key("regionReq"));
        return;
      }
      if (!values.city) {
        notifyError(key("cityReq"));
        return;
      }
      formData.append("city", values.city);
      formData.append("region", values.region);
      formData.append("neighborhood", values.neighborhood);
    }
  
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (values.address) {
      formData.append("address", values.address);
    }

    if (values.tags?.length > 0) {
      values.tags.forEach((obj, index) => {
        formData.append(`tags[${index}]`, obj.value);
      });
    }

    formData.append("price", values.price);
    formData.append("area", values.area);

    mutate(
      {
        formData: formData,
        token: token,
        method: "add",
        type: "estates",
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            dispatch(fetchAccountData(token));
            notifySuccess(key("addedSuccess"));
            setSelectedFile(null);
            setImagePreviewUrl(null);
            resetForm();
            hideModal();
          } else if (
            data.response.data.message ===
            "Max estates reached for this compound"
          ) {
            notifyError(key("maxEstatesInCompoundError"));
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
    compound: string().required(key("fieldReq")),
    name: string().required(key("fieldReq")),
    description: string()
      .min(5, key("descValidation"))
      .required(key("fieldReq")),

    // region: string().when("compound", {
    //   is: (compound) => compound === "not",
    //   then: (schema) => schema.required(key("fieldReq")),
    //   otherwise: (schema) => schema,
    // }),

    // city: string().when("compound", {
    //   is: (compound) => compound === "not",
    //   then: (schema) => schema.required(key("fieldReq")),
    //   otherwise: (schema) => schema,
    // }),
    region: string(),
    city: string(),
    address: string(),
    neighborhood: string(),
    price: string().required(key("fieldReq")),
    area: string().required(key("fieldReq")),
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file?.size > maxFileSize) {
      notifyError(key("imgSizeError"));
      return;
    }

    setSelectedFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    e.target.value = null;
  };

  const handleRegionChange = (selectedRegion, setFieldValue) => {
    setFieldValue("region", selectedRegion || "");
    setFieldValue("city", "");
    setFieldValue("neighborhood", "");
    let cities;
    if (isArLang) {
      cities = citiesByRegionAr[selectedRegion] || [];
    } else {
      cities = citiesByRegion[selectedRegion] || [];
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

  const clearReigonsField = (val, setFieldValue) => {
    if (val !== "not") {
      setFieldValue("region", "");
      setFieldValue("city", "");
      setFieldValue("neighborhood", "");
    }
  };

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
              <div className="field mb-1">
                <label htmlFor="compound">
                  {key("compound")} {requiredLabel}
                </label>
                <Select
                  id="compound"
                  name="compound"
                  options={compoundsOptions}
                  onChange={(val) => {
                    setFieldValue("compound", val ? val.value : "not");
                    clearReigonsField(val ? val.value : "not", setFieldValue);
                  }}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  isDisabled={compId ? true : false}
                  placeholder={
                    compId
                      ? compoundsOptions?.find((comp) => comp.value === compId)
                          ?.label || ""
                      : ""
                  }
                />
                <ErrorMessage name="compound" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="name">
                  {key("name")} {requiredLabel}
                </label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component={InputErrorMessage} />
              </div>

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

              <div className="field mb-1">
                <label htmlFor="tags">{key("searchKeys")}</label>
                <CreatableSelect
                  isClearable
                  options={tagsOptions}
                  isMulti
                  onChange={(val) => setFieldValue("tags", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                  formatCreateLabel={(inputValue) =>
                    isArLang ? `إضافة "${inputValue}"` : `Add "${inputValue}"`
                  }
                />
                <ErrorMessage name="tags" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="area">
                  {key("area")} ({key("areaUnit")}) {requiredLabel}
                </label>
                <Field type="text" id="area" name="area" />
                <ErrorMessage name="area" component={InputErrorMessage} />
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
                  value={
                    (isArLang ? SaudiRegionAr : SaudiRegion).find(
                      (opt) => opt.value === values.region
                    ) || null
                  }
                  onChange={(selected) =>
                    handleRegionChange(selected?.value || null, setFieldValue)
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  isDisabled={
                    (values.compound && values.compound !== "not") || compId
                  }
                  placeholder=""
                />
                <ErrorMessage name="region" component={InputErrorMessage} />
              </div>

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
                  isDisabled={
                    !values.region ||
                    compId ||
                    (values.compound && values.compound !== "not")
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                />
                <ErrorMessage name="city" component={InputErrorMessage} />
              </div>

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
                  isDisabled={
                    !values.city ||
                    compId ||
                    (values.compound && values.compound !== "not")
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                />
                <ErrorMessage
                  name="neighborhood"
                  component={InputErrorMessage}
                />
              </div>

              <div className="field mb-1">
                <label htmlFor="address">{key("address")}</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="price">
                  {key("unitPrice")} ({key("sar")}) {requiredLabel}
                </label>
                <Field type="text" id="price" name="price" />
                <ErrorMessage name="price" component={InputErrorMessage} />
              </div>
            </Col>
          </Row>
          <div className={styles.photo_field}>
            <h6 className="mb-3 text-start">{key("estateImage")}</h6>
            <label
              className={
                imagePreviewUrl ? styles.photo_label_img : styles.photo_label
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
                <FontAwesomeIcon className={styles.img_icon} icon={faImage} />
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

          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
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

export default AddEstate;
