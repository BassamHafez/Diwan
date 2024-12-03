import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { date, number, object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
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
import { formattedDate } from "../../../../Components/Logic/LogicFun";

const UpdateTask = ({ hideModal, refetch, task }) => {
  const [compoundsOptions, setCompoundsOptions] = useState([]);
  const [contactsOptions, setContactsOptions] = useState([]);
  const [estatesOptions, setEstatesOptions] = useState([]);

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
    let estateOptions;
    if (estates) {
      estateOptions = estates.data?.map((estate) => {
        return { label: estate.name, value: estate._id };
      });
      setEstatesOptions(estateOptions);
    }
  }, [estates]);

  useEffect(() => {
    let compoundOptions;
    if (compounds) {
      compoundOptions = compounds.data?.map((compound) => {
        return { label: compound.name, value: compound._id };
      });
      setCompoundsOptions(compoundOptions);
    }
  }, [compounds]);

  useEffect(() => {
    let contactOptions;
    if (services) {
      contactOptions = services.data?.map((compound) => {
        return { label: compound.name, value: compound._id };
      });
    }
    setContactsOptions(contactOptions);
  }, [services]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    title: task.title || "",
    description: task.description || "",
    date: formattedDate(task.date) || "",
    compound: task.compound
      ? compoundsOptions?.find((comp) => comp.value === task.compound._id) || ""
      : "",
    estate: task.estate
      ? estatesOptions?.find((estate) => estate.value === task.estate._id) || ""
      : "",
    contact: task.contact
      ? contactsOptions?.find(
          (contact) => contact.value === task.contact._id
        ) || ""
      : "",
    type: isArLang
      ? taskTypeOptions["ar"]?.find(
          (taskOption) => taskOption.value === task.type?.trim()
        )
      : taskTypeOptions["en"]?.find(
          (taskOption) => taskOption.value === task.type?.trim()
        ) || "",
    cost: task.cost || "",
    priority: isArLang
      ? prioritysOptions["ar"]?.find((pri) => pri.value === task.priority)
      : prioritysOptions["en"]?.find((pri) => pri.value === task.priority) ||
        "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      title: values.title,
      date: values.date,
      type: values.type.value,
      cost: values.cost.toString(),
      priority: values.priority.value,
    };

    if (task.estate && values.estate) {
      updatedValues.estate = values.estate.value;
    }
    if (task.compound && values.compound) {
      updatedValues.compound = values.compound.value;
    }

    if (values.contact) {
      updatedValues.contact = values.contact.value;
    }
    if (values.description) {
      updatedValues.description = values.description;
    }

    console.log(updatedValues);
    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "patch",
        type: `tasks/${task._id}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            notifySuccess(key("updatedSucc"));
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
    contact: object()
      .shape({
        label: string(),
        value: string(),
      })
      .nullable(),
    type: object()
      .shape({
        label: string(),
        value: string(),
      })
      .required(key("fieldReq")),
    cost: number()
      .min(0, key("positiveOnlyValidation"))
      .required(key("fieldReq")),
    priority: object()
      .shape({
        label: string(),
        value: string(),
      })
      .required(key("fieldReq")),
    description: string(),
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
              {task.compound ? (
                <div className="field mb-1">
                  <label htmlFor="compound">
                    {key("compound")} {requiredLabel}
                  </label>
                  <Select
                    id="compound"
                    name="compound"
                    value={values.compound}
                    options={compoundsOptions}
                    onChange={(val) => setFieldValue("compound", val || null)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    placeholder={isArLang ? "" : "select"}
                  />
                  <ErrorMessage name="compound" component={InputErrorMessage} />
                </div>
              ) : (
                <div className="field mb-1">
                  <label htmlFor="estate">{key("theUnit")}</label>
                  <Select
                    id="estate"
                    name="estate"
                    options={estatesOptions}
                    value={values.estate}
                    onChange={(val) => setFieldValue("estate", val || null)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? false : true}
                    placeholder={isArLang ? "" : "select"}
                  />
                  <ErrorMessage name="estate" component={InputErrorMessage} />
                </div>
              )}
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="contact">
                  {key("singleContactType")} {requiredLabel}
                </label>
                <Select
                  id="contact"
                  name="contact"
                  value={values.contact}
                  options={contactsOptions}
                  onChange={(val) => setFieldValue("contact", val ? val : null)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="contact" component={InputErrorMessage} />
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
                  value={values.type}
                  options={
                    isArLang ? taskTypeOptions["ar"] : taskTypeOptions["en"]
                  }
                  onChange={(val) => setFieldValue("type", val || null)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="type" component={InputErrorMessage} />
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
              <div className="field mb-1">
                <label htmlFor="priority">
                  {key("priority")} {requiredLabel}
                </label>
                <Select
                  id="priority"
                  name="priority"
                  value={values.priority}
                  options={
                    isArLang ? prioritysOptions["ar"] : prioritysOptions["en"]
                  }
                  onChange={(val) => setFieldValue("priority", val || null)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="priority" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={12}>
              <div className="field">
                <label htmlFor="description">{key("description")}</label>
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

export default UpdateTask;
