import { useState } from "react";
import styles from "./PropertyForms.module.css";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faImage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import InputErrorMessage from "../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Select from "react-select";
import {
  agents,
  citiesByRegion,
  districtsByCity,
  SaudiRegion,
  tagOptions,
} from "../../../Components/Logic/StaticLists";
import CreatableSelect from "react-select/creatable";

const AddEstate = ({hideModal}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    compound:"",
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
    formData.append("address", values.address);
    formData.append("neighborhood", values.neighborhood);
    if (values.tags?.length > 0) {
      values.tags.forEach((obj, index) => {
        formData.append(`tags[${index}]`, obj.value);
      });
    }
    mutate(
      {
        formData: formData,
        token: token,
        method: "add",
        type: "compounds",
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            // refetch();
            notifySuccess(key("addedSuccess"));
            setSelectedFile(null);
            setImagePreviewUrl(null);
            resetForm();
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
    description: string().required(key("fieldReq")),
    city: string().required(key("fieldReq")),
    region: string().required(key("fieldReq")),
    address: string().required(key("fieldReq")),
    neighborhood: string(),
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

  const handleRegionChange = (selectedRegion, setFieldValue) => {
    setFieldValue("region", selectedRegion?.value || "");
    setFieldValue("city", "");
    setFieldValue("neighborhood", "");
    const cities = citiesByRegion[selectedRegion?.value] || [];
    setCityOptions(cities);
    setDistrictOptions([]);
  };

  const handleCityChange = (selectedCity, setFieldValue) => {
    setFieldValue("city", selectedCity?.value || "");
    setFieldValue("neighborhood", "");
    const districts = districtsByCity[selectedCity?.value] || [];
    setDistrictOptions(districts);
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
                <label htmlFor="tags">{key("tag")}</label>
                <CreatableSelect
                  isClearable
                  options={tagOptions}
                  isMulti
                  onChange={(val) => setFieldValue("tags", val)}
                  className="text-start"
                />
                <ErrorMessage name="tags" component={InputErrorMessage} />
              </div>

              <div className="field mb-1">
                <label htmlFor="lessor">{key("lessor")}</label>
                <Select
                  id="lessor"
                  name="lessor"
                  options={agents}
                  onChange={(val) => setFieldValue("lessor", val.value)}
                  className="text-start"
                />
                <ErrorMessage name="lessor" component={InputErrorMessage} />
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
                  options={SaudiRegion}
                  onChange={(selected) =>
                    handleRegionChange(selected, setFieldValue)
                  }
                  value={
                    SaudiRegion.find((opt) => opt.value === values.region) ||
                    null
                  }
                  className="text-start"
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
                  className="text-start"
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
                  className="text-start"
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
                <label htmlFor="agent">{key("agent")}</label>
                <Select
                  id="agent"
                  name="agent"
                  options={agents}
                  onChange={(val) => setFieldValue("agent", val.value)}
                  className="text-start"
                />
                <ErrorMessage name="agent" component={InputErrorMessage} />
              </div>
            </Col>
          </Row>
          <div className={styles.photo_field}>
            <h6 className="mb-3 text-start">{key("compoundImage")}</h6>
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
            <button onClick={hideModal} className="cancel_btn my-2">{key("cancel")}</button>

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
