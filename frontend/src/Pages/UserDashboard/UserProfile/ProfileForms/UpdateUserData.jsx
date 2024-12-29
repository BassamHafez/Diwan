import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import {faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeFormData } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import styles from "./ProfileForms.module.css";
import { useDispatch } from "react-redux";
import fetchProfileData from "../../../../Store/profileInfo-actions";
import { useState } from "react";
import { maxFileSize } from "../../../../Components/Logic/StaticLists";

const UpdateUserData = ({ profileInfo, hideModal }) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();

  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    name: profileInfo.name || "",
    email: profileInfo.email || "",
    phone: profileInfo.phone || "",
    photo: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);

    mutate(
      {
        formData: formData,
        token: token,
        method: "patch",
        type: `users/me`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            dispatch(fetchProfileData(token));
            notifySuccess(key("updatedSucc"));
            resetForm();
            setSelectedFile(null);
            setImagePreviewUrl(null);
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

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className={styles.photo_field}>
          <h6 className="mb-3">{key("avatar")} (1/1)</h6>
          <label className={styles.photo_label_img} htmlFor="avatar">
            <FontAwesomeIcon title={key("changePhoto")} icon={faCamera}/>
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Uploaded Preview"
                className={styles.image_preview}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_Host}${profileInfo.photo}`}
                alt="old_image_Preview"
                className={styles.image_preview}
              />
            )}
          </label>
          <input
            type="file"
            id="avatar"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
          <ErrorMessage name="photo" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="name">
            {key("name")} {requiredLabel}
          </label>
          <Field type="text" id="name" name="name" />
          <ErrorMessage name="name" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="phoneInput">
            {key("phone")} {requiredLabel}
          </label>
          <Field
            type="tel"
            id="phoneInput"
            name="phone"
            placeholder="05XXXXXXXX"
          />
          <ErrorMessage name="phone" component={InputErrorMessage} />
        </div>
        <div className="field">
          <label htmlFor="email">
            {key("email")} {requiredLabel}
          </label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component={InputErrorMessage} />
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
    </Formik>
  );
};

export default UpdateUserData;
