import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faImage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeFormData } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "../../Admin.module.css";
import { useState } from "react";
import { maxFileSize } from "../../../../Components/Logic/StaticLists";

const AddTestimonial = ({ hideModal, refetch }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
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
    name: "",
    title: "",
    comment: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    formData.append("name", values.name);
    formData.append("title", values.title);
    formData.append("comment", values.comment);

    mutate(
      {
        formData: formData,
        token: token,
        method: "add",
        type: `testimonials`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
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
    name: string().required(key("fieldReq")),
    title: string().required(key("fieldReq")),
    comment: string().min(5, key("min5")).required(key("fieldReq")),
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
    >
      <Form>
        <Row className="g-3 over">
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
              <label htmlFor="title">
                {key("job")} {requiredLabel}
              </label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage name="title" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={12}>
            <div className="field">
              <label htmlFor="comment">
                {key("comment")} {requiredLabel}
              </label>
              <Field
                as="textarea"
                className="text_area"
                id="comment"
                name="comment"
              />
              <ErrorMessage name="comment" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={12}>
            <div className={styles.photo_field}>
              <h6 className="mb-3">{key("avatar")}</h6>
              <label
                className={
                  imagePreviewUrl ? styles.photo_label_img : styles.photo_label
                }
                htmlFor="image"
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
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
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
    </Formik>
  );
};

export default AddTestimonial;
