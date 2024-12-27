import { useMutation } from "@tanstack/react-query";
import {Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../../util/Http";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "../../Admin.module.css";
import { useState } from "react";

const UpdateAssets = ({ refetch, configs }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState(null);
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    banner: "",
    banner2: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    const files = [
      { key: "banner", file: selectedFile },
      { key: "banner2", file: selectedFile2 },
    ];

    files.forEach(({ key, file }) => {
      if (file) {
        formData.append(key, file);
      }
    });

    mutate(
      {
        formData: formData,
        token: token,
        method: "patch",
        type: "configs/secondary-banners",
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            if (refetch) {
              refetch();
            }
            notifySuccess(key("updatedSucc"));
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

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    const inputId = e.currentTarget.id;

    if (file?.size > 20 * 1024 * 1024) {
      notifyError(key("imgSizeError"));
      return;
    }

    if (inputId === "banner") {
      setSelectedFile(file);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);
      }
    } else {
      setSelectedFile2(file);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl2(previewUrl);
      }
    }

    e.target.value = null;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form>
        <Row>
          <Col md={6} className="mb-4 p-2 position-relative">
            <div className={styles.photo_field}>
              <h6 className="mb-3">{key("banner")}</h6>
              <label className={styles.photo_label_img} htmlFor="banner">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded Preview"
                    className={styles.image_preview}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_Host}${configs.banner}`}
                    alt="old_image_Preview"
                    className={styles.image_preview}
                  />
                )}
              </label>
              <input
                type="file"
                id="banner"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
            </div>
          </Col>
          <Col md={6} className="mb-4 p-2 position-relative">
            <div className={styles.photo_field}>
              <h6 className="mb-3">{key("banner2")}</h6>
              <label className={styles.photo_label_img} htmlFor="banner2">
                {imagePreviewUrl2 ? (
                  <img
                    src={imagePreviewUrl2}
                    alt="Uploaded Preview2"
                    className={styles.image_preview}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_Host}${configs.banner2}`}
                    alt="old_image_Preview2"
                    className={styles.image_preview}
                  />
                )}
              </label>
              <input
                type="file"
                id="banner2"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-end align-items-center mt-3">
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

export default UpdateAssets;
