import { useEffect, useState } from "react";
import styles from "./PropertyForms.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
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
  SaudiRegion,
  SaudiRegionAr,
} from "../../../Components/Logic/StaticLists";
import CreatableSelect from "react-select/creatable";
import { useParams } from "react-router-dom";
import { convertTpOptionsFormate } from "../../../Components/Logic/LogicFun";

const UpdateEstate = ({
  hideModal,
  refetch,
  estateData,
  estateParentCompound,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [compoundsOptions, setCompoundsOptions] = useState([]);
  const [brokersOptions, setBrokersOptions] = useState([]);
  const [landlordOptions, setlandlordOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const queryClient = useQueryClient();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { propId } = useParams();

  const { data: compounds } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: !!token,
  });

  const { data: landlords } = useQuery({
    queryKey: ["landlord", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/landlords",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const { data: brokers } = useQuery({
    queryKey: ["brokers", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "contacts/brokers", token: token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  useEffect(() => {
    setlandlordOptions(convertTpOptionsFormate(landlords?.data));
  }, [landlords]);

  useEffect(() => {
    setBrokersOptions(convertTpOptionsFormate(brokers?.data));
  }, [brokers]);

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

  const { data: tags, refetch: refetchTags } = useQuery({
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

  const estateParent = estateParentCompound ? estateParentCompound : estateData;

  const initialValues = {
    image: "",
    compound: compoundsOptions.find(
      (option) => option.value === estateParentCompound?._id
    ) || { label: key("notSpecified"), value: "not" },
    name: estateData.name || "",
    description: estateData.description || "",
    region: estateParent.region || "",
    city: estateParent.city || "",
    neighborhood: estateParent.neighborhood || "",
    address: estateData.address || "",
    tags:
      estateData.tags.map((tag) => {
        return { label: tag, value: tag };
      }) || [],
    price: estateData.price || "",
    area: estateData.area || "",
    waterAccountNumber: estateData.waterAccountNumber || "",
    electricityAccountNumber: estateData.electricityAccountNumber || "",
    broker: estateParent?.broker?._id || "",
    landlord: estateParent?.landlord?._id || "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    formData.append("name", values.name);
    formData.append("description", values.description);

    if (!values.compound || values.compound.value === "not") {
      formData.append("city", values.city);
      formData.append("region", values.region);
      formData.append("neighborhood", values.neighborhood);
    }
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

    if (values.landlord) {
      formData.append("landlord", values.landlord);
    }
    if (values.broker) {
      formData.append("broker", values.broker);
    }
    if (values.waterAccountNumber) {
      formData.append(
        "waterAccountNumber",
        values.waterAccountNumber.toString()
      );
    }
    if (values.electricityAccountNumber) {
      formData.append(
        "electricityAccountNumber",
        values.electricityAccountNumber.toString()
      );
    }
    mutate(
      {
        formData: formData,
        token: token,
        method: "patch",
        type: `estates/${propId}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            refetchTags();
            queryClient.invalidateQueries(["estates", token]);
            notifySuccess(key("updatedSucc"));
            setSelectedFile(null);
            setImagePreviewUrl(null);
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
    compound: string()
      .nullable()
      .transform((value) => (value?.value ? value.value : value)),
    name: string().required(key("fieldReq")),
    description: string()
      .min(5, key("descValidation"))
      .required(key("fieldReq")),
    city: string().when("compound", (compound, schema) =>
      !compound || compound.value === "not"
        ? schema.required(key("fieldReq"))
        : schema
    ),

    region: string().when("compound", (compound, schema) =>
      !compound || compound.value === "not"
        ? schema.required(key("fieldReq"))
        : schema
    ),

    address: string(),
    neighborhood: string(),
    price: string().required(key("fieldReq")),
    area: string().required(key("fieldReq")),
    broker: string(),
    lessor: string(),
    waterAccountNumber: string().matches(/^\d{10}$/, key("waterMinValidation")),
    electricityAccountNumber: string().matches(
      /^\d{11}$/,
      key("elcMinValidation")
    ),
  });

  useEffect(() => {
    const settingCityAndDistrictOptionsOptions = () => {
      let cities;
      let districts;
      if (isArLang) {
        cities = citiesByRegionAr[estateParent.region] || [];
        districts = districtsByCityAr[estateParent.city] || [];
      } else {
        cities = citiesByRegion[estateParent.region] || [];
        districts = districtsByCity[estateParent.city] || [];
      }
      let finalDistricts = [
        { label: key("notSpecified"), value: "not specified" },
        ...districts,
      ];

      setCityOptions(cities);
      setDistrictOptions(finalDistricts);
    };

    settingCityAndDistrictOptionsOptions();
  }, [estateParent, isArLang, key]);

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file?.size > 20 * 1024 * 1024) {
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
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="compound">{key("compound")}</label>
                <Select
                  id="compound"
                  name="compound"
                  value={values.compound}
                  options={compoundsOptions}
                  onChange={(val) => setFieldValue("compound", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  isDisabled={true}
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
                  onChange={(val) => setFieldValue("tags", val || [])}
                  value={values.tags}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="tags" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="landlord">{key("theLandlord")}</label>
                <Select
                  id="landlord"
                  name="landlord"
                  options={landlordOptions}
                  value={
                    landlordOptions?.find(
                      (landlord) => landlord.value === values.landlord
                    ) || null
                  }
                  onChange={(val) => setFieldValue("landlord", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                  isDisabled={
                    values.compound && values.compound?.value !== "not"
                  }
                />
                <ErrorMessage name="landlord" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="waterAccountNumber">
                  {key("waterAccount")}
                </label>
                <Field
                  type="number"
                  id="waterAccountNumber"
                  name="waterAccountNumber"
                />
                <ErrorMessage
                  name="waterAccountNumber"
                  component={InputErrorMessage}
                />
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
                  onChange={(selected) =>
                    handleRegionChange(selected, setFieldValue)
                  }
                  value={
                    (isArLang ? SaudiRegionAr : SaudiRegion).find(
                      (opt) => opt.value === values.region
                    ) || null
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  isDisabled={
                    values.compound && values.compound?.value !== "not"
                  }
                  placeholder={isArLang ? "" : "select"}
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
                    (values.compound && values.compound?.value !== "not")
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="city" component="div" className="error" />
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
                    (values.compound && values.compound?.value !== "not")
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage
                  name="neighborhood"
                  component="div"
                  className="error"
                />
              </div>

              <div className="field mb-1">
                <label htmlFor="address">{key("address")}</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="price">
                  {key("price")} ({key("sar")}) {requiredLabel}
                </label>
                <Field type="text" id="price" name="price" />
                <ErrorMessage name="price" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="broker">{key("broker")}</label>
                <Select
                  id="broker"
                  name="broker"
                  options={brokersOptions}
                  value={
                    brokersOptions?.find(
                      (broker) => broker.value === values.broker
                    ) || null
                  }
                  onChange={(val) => setFieldValue("broker", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                  isDisabled={
                    values.compound && values.compound?.value !== "not"
                  }
                />
                <ErrorMessage name="broker" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="electricityAccountNumber">
                  {key("elecAccount")}
                </label>
                <Field
                  type="number"
                  id="electricityAccountNumber"
                  name="electricityAccountNumber"
                />
                <ErrorMessage
                  name="electricityAccountNumber"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
          </Row>
          <div className={styles.photo_field}>
            <h6 className="mb-3 text-start">{key("estateImage")}</h6>
            <label className={styles.photo_label_img} htmlFor="compoundImage">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Uploaded Preview"
                  className={styles.image_preview}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_Host}${estateData.image}`}
                  alt="old_image_Preview"
                  className={styles.image_preview}
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

          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
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
      )}
    </Formik>
  );
};

export default UpdateEstate;
