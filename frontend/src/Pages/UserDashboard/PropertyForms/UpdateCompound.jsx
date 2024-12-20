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
import { convertTpOptionsFormate } from "../../../Components/Logic/LogicFun";

const UpdateCompound = ({ compoundData, hideModal, refetch }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [brokersOptions, setBrokersOptions] = useState([]);
  const [landlordOptions, setlandlordOptions] = useState([]);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const queryClient = useQueryClient();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { data: tags, refetch: refetchTags } = useQuery({
    queryKey: ["tags", token],
    queryFn: () => mainFormsHandlerTypeRaw({ token: token, type: "tags" }),
    enabled: !!token,
    staleTime: Infinity,
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
    let myTagsOptions = tags?.data?.map((tag) => {
      return { label: tag, value: tag };
    });
    setTagsOptions(myTagsOptions);
  }, [tags]);

  useEffect(() => {
    setlandlordOptions(convertTpOptionsFormate(landlords?.data));
  }, [landlords]);

  useEffect(() => {
    setBrokersOptions(convertTpOptionsFormate(brokers?.data));
  }, [brokers]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    name: compoundData.name || "",
    description: compoundData.description || "",
    region: compoundData.region || "",
    city: compoundData.city || "",
    neighborhood: compoundData.neighborhood || "",
    address: compoundData.address || "",
    tags:
      compoundData.tags.map((tag) => {
        return { label: tag, value: tag };
      }) || [],
    broker: compoundData?.broker?._id || "",
    landlord: compoundData?.landlord?._id || "",
    waterAccountNumber: compoundData.waterAccountNumber || "",
    electricityAccountNumber: compoundData.electricityAccountNumber || "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
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
    if (values.tags?.length > 0) {
      values.tags.forEach((obj, index) => {
        formData.append(`tags[${index}]`, obj.value);
      });
    }
    mutate(
      {
        formData: formData,
        token: token,
        method: "patch",
        type: `compounds/${compoundData._id}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            refetchTags();
            queryClient.invalidateQueries(["compounds", token]);
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

  const validationSchema = object({
    name: string().required(key("fieldReq")),
    description: string()
      .min(5, key("descValidation"))
      .required(key("fieldReq")),
    city: string().required(key("fieldReq")),
    region: string().required(key("fieldReq")),
    neighborhood: string().required(key("fieldReq")),
    address: string(),
    broker: string(),
    lessor: string(),
    waterAccountNumber: string().matches(/^\d{10}$/, key("waterMinValidation")),
    electricityAccountNumber: string().matches(
      /^\d{11}$/,
      key("elcMinValidation")
    ),
  });

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

  useEffect(() => {
    const settingCityAndDistrictOptionsOptions = () => {
      let cities;
      let districts;
      if (isArLang) {
        cities = citiesByRegionAr[compoundData.region] || [];
        districts = districtsByCityAr[compoundData.city] || [];
      } else {
        cities = citiesByRegion[compoundData.region] || [];
        districts = districtsByCity[compoundData.city] || [];
      }
      let finalDistricts = [
        { label: key("notSpecified"), value: "not specified" },
        ...districts,
      ];

      setCityOptions(cities);
      setDistrictOptions(finalDistricts);
    };

    settingCityAndDistrictOptionsOptions();
  }, [compoundData, isArLang, key]);

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
                <label htmlFor="landlord">{key("landlord")}</label>
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
                />
                <ErrorMessage name="landlord" component={InputErrorMessage} />
              </div>

              <div className="field">
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
                  isDisabled={!values.region}
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
                  isDisabled={!values.city}
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
                />
                <ErrorMessage name="broker" component={InputErrorMessage} />
              </div>

              <div className="field">
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
            </Col>
          </Row>
          <div className={styles.photo_field}>
            <h6 className="mb-3">{key("compoundImage")}</h6>
            <label className={styles.photo_label_img} htmlFor="compoundImage">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Uploaded Preview"
                  className={styles.image_preview}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_Host}${compoundData.image}`}
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
      )}
    </Formik>
  );
};

export default UpdateCompound;
