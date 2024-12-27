import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import InputErrorMessage from "../../../../Components/UI/Words/InputErrorMessage";
import { useDispatch } from "react-redux";
import fetchAccountData from "../../../../Store/accountInfo-actions";
import Select from "react-select";
import {
  citiesByRegion,
  citiesByRegionAr,
  SaudiRegion,
  SaudiRegionAr,
} from "../../../../Components/Logic/StaticLists";
import { useEffect, useState } from "react";

const UpdateAccountData = ({ accountInfo, hideModal }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: accountInfo?.account?.name || "",
    phone: accountInfo?.account?.phone || "",
    region: accountInfo?.account?.region || "",
    city: accountInfo?.account?.city || "",
    address: accountInfo?.account?.address || "",
    commercialRecord: accountInfo?.account?.commercialRecord || "",
    taxNumber: accountInfo?.account?.taxNumber || "",
  };

  const onSubmit = (values, { resetForm }) => {
    
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== "" && value !== undefined
      )
    );

    if(filteredValues.commercialRecord){
      filteredValues.commercialRecord=filteredValues.commercialRecord.toString()
    }
    if(filteredValues.taxNumber){
      filteredValues.taxNumber=filteredValues.taxNumber.toString()
    }

    mutate(
      {
        formData: filteredValues,
        token: token,
        method: "patch",
        type: `accounts/${accountInfo?.account?._id}`,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            dispatch(fetchAccountData(token));
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

  const validationSchema = object().shape({
    name: string().required(key("fieldReq")),
    address: string().required(key("fieldReq")),
    phone: string()
      .matches(/^05\d{8}$/, key("invalidPhone"))
      .required(key("fieldReq")),
    commercialRecord: string().matches(/^\d{10}$/, key("CommercialValidation")),
    taxNumber: string().matches(/^3\d{14}$/, key("taxNumberValidation")),
    city: string().required(key("fieldReq")),
    region: string().required(key("fieldReq")),
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
  };

  useEffect(() => {
    const settingCityOptions = () => {
      let cities;
      if (isArLang) {
        cities = citiesByRegionAr[accountInfo?.account?.region] || [];
      } else {
        cities = citiesByRegion[accountInfo?.account?.region] || [];
      }

      setCityOptions(cities);
    };

    settingCityOptions();
  }, [accountInfo, isArLang, key]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form>
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

          <div className="field mb-1">
            <label>
              {key("city")} {requiredLabel}
            </label>
            <Select
              options={cityOptions}
              onChange={(selected) =>
                setFieldValue("city", selected?.value || "")
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

          <div className="field">
            <label htmlFor="address">
              {key("address")} {requiredLabel}
            </label>
            <Field type="address" id="address" name="address" />
            <ErrorMessage name="address" component={InputErrorMessage} />
          </div>

          <div className="field">
            <label htmlFor="commercialRecord">
              {key("commercialRecord")}
            </label>
            <Field
              type="number"
              placeholder="XXXXXXXXXX"
              id="commercialRecord"
              name="commercialRecord"
            />
            <ErrorMessage
              name="commercialRecord"
              component={InputErrorMessage}
            />
          </div>
          <div className="field">
            <label htmlFor="taxNumber">
              {key("taxNumber")}
            </label>
            <Field
              type="number"
              placeholder="3XXXXXXXXXXXXXX"
              id="taxNumber"
              name="taxNumber"
            />
            <ErrorMessage name="taxNumber" component={InputErrorMessage} />
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

export default UpdateAccountData;
