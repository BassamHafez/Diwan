import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, number, object, string } from "yup";
import {
  faBuilding,
  faCouch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  mainFormsHandlerTypeFormData,
  mainFormsHandlerTypeRaw,
} from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import Select from "react-select";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import {
  prioritysOptions,
  taskTypeOptions,
} from "../../../../Components/Logic/StaticLists";
import styles from "./TaskForms.module.css";
import { convertTpOptionsFormate } from "../../../../Components/Logic/LogicFun";

const AddTask = ({ hideModal, refetch }) => {
  const [compoundsOptions, setCompoundsOptions] = useState([]);
  const [estatesOptions, setEstatesOptions] = useState([]);
  const [contactsOptions, setContactsOptions] = useState([]);
  const [isCompound, setIsCompound] = useState(false);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data: compounds } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const { data: estates } = useQuery({
    queryKey: ["estates", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "estates", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const { data: services } = useQuery({
    queryKey: ["service", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/services",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  useEffect(() => {
    setEstatesOptions(convertTpOptionsFormate(estates?.data));
    setCompoundsOptions(convertTpOptionsFormate(compounds?.data?.compounds));
    setContactsOptions(convertTpOptionsFormate(services?.data));
  }, [estates, compounds,services]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    title: "",
    description: "",
    date: "",
    estate: "",
    compound: "",
    contact: "",
    type: "",
    cost: "",
    priority: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      title: values.title,
      date: values.date,
      type: values.type,
      cost: values.cost,
      priority: values.priority,
    };

    if (!isCompound && values.estate) {
      updatedValues.estate = values.estate.value;
    } else if (isCompound && values.compound) {
      updatedValues.compound = values.compound.value;
    }

    if (values.contact) {
      updatedValues.contact = values.contact;
    }
    if (values.description) {
      updatedValues.description = values.description;
    }

    console.log(updatedValues);
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "add",
        type: `tasks`,
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
    title: string().required(key("fieldReq")),
    date: date().required(key("fieldReq")),
    estate: object()
      .shape({
        label: string(),
        value: string(),
      })
      .nullable(),
    compound: object()
      .shape({
        label: string(),
        value: string(),
      })
      .nullable(),
    contact: string().nullable(),
    type: string().required(key("fieldReq")),
    cost: number()
      .min(0, key("positiveOnlyValidation"))
      .required(key("fieldReq")),
    priority: string().required(key("fieldReq")),
    description: string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            <Col sm={12}>
              <div className="field">
                <label htmlFor="title">
                  {key("title")} {requiredLabel}
                </label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={12}>
              <div className="field">
                <label htmlFor="taskDate">
                  {key("taskDate")} {requiredLabel}
                </label>
                <Field type="date" id="taskDate" name="date" />
                <ErrorMessage name="date" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="taskType">
                  {key("taskType")} {requiredLabel}
                </label>
                <Select
                  id="taskType"
                  name="type"
                  options={
                    isArLang ? taskTypeOptions["ar"] : taskTypeOptions["en"]
                  }
                  onChange={(val) => setFieldValue("type", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="type" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="contact">{key("singleContactType")}</label>
                <Select
                  id="contact"
                  name="contact"
                  options={contactsOptions}
                  onChange={(val) =>
                    setFieldValue("contact", val ? val.value : null)
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                  isClearable
                />
                <ErrorMessage name="contact" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="priority">
                  {key("priority")} {requiredLabel}
                </label>
                <Select
                  id="priority"
                  name="priority"
                  options={
                    isArLang ? prioritysOptions["ar"] : prioritysOptions["en"]
                  }
                  onChange={(val) => setFieldValue("priority", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="priority" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="cost">
                  {key("cost")} ({key("sarSmall")}) {requiredLabel}
                </label>
                <Field type="number" id="cost" name="cost" />
                <ErrorMessage name="cost" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              {!isCompound ? (
                <div className="field mb-1">
                  <label htmlFor="estate">{key("theUnit")}</label>
                  <Select
                    id="estate"
                    name="estate"
                    options={estatesOptions}
                    value={values.estate}
                    onChange={(val) =>
                      setFieldValue("estate", val ? val : null)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    placeholder={isArLang ? "" : "select"}
                    isClearable
                  />
                  <ErrorMessage name="estate" component={InputErrorMessage} />
                </div>
              ) : (
                <div className="field mb-1">
                  <label htmlFor="compound">{key("compound")}</label>
                  <Select
                    id="compound"
                    name="compound"
                    options={compoundsOptions}
                    value={values.compound}
                    onChange={(val) =>
                      setFieldValue("compound", val ? val : null)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    placeholder={isArLang ? "" : "select"}
                    isClearable
                  />
                  <ErrorMessage name="compound" component={InputErrorMessage} />
                </div>
              )}
            </Col>
            <Col md={6} className="d-flex align-items-center">
              <ul className="h-100 d-flex flex-column justify-content-end">
                <li
                  onClick={() => setIsCompound(true)}
                  className={`my-1 ${
                    isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("compound")}
                </li>
                <li
                  onClick={() => setIsCompound(false)}
                  className={`my-1 ${
                    !isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCouch}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("theUnit")}
                </li>
              </ul>
            </Col>
            <Col sm={12}>
              <div className="field">
                <label htmlFor="description">
                  {key("description")}
                </label>
                <Field
                  as="textarea"
                  className="text_area"
                  id="description"
                  name="description"
                />
                <ErrorMessage
                  name="description"
                  component={InputErrorMessage}
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
      )}
    </Formik>
  );
};

export default AddTask;
