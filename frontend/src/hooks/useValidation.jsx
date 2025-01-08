import { string, ref } from "../shared/constants";
import { useMemo, useTranslation } from "../shared/hooks";

const useValidation = () => {
  const { t: key } = useTranslation();

  const mainReqValidation = useMemo(
    () => string().required(`${key("fieldReq")}`),
    [key]
  );

  const phoneValidation = useMemo(
    () =>
      string()
        .matches(/^05\d{8}$/, key("invalidPhone")),
    [key]
  );

  const passwordValidation = useMemo(
    () =>
      string()
        .min(5, key("min5"))
        .required(key("fieldReq"))
        .matches(/[A-Z]+/, key("validationUpperCase"))
        .matches(/[a-z]+/, key("validationLowerCase"))
        .matches(/[0-9]+/, key("validationNumber")),
    [key]
  );

  const confirmPasswordValidation = useMemo(
    () =>
      string()
        .oneOf([ref("password"), null], `${key("passwordMismatch")}`)
        .required(`${key("fieldReq")}`),
    [key]
  );

  const emailValidation = useMemo(
    () =>
      string()
        .email(`${key("emailValidation1")}`)
        .required(`${key("emailValidation2")}`),
    [key]
  );

  const nameValidation = useMemo(
    () =>
      string()
        .min(3, `${key("nameValidation1")}`)
        .max(20, `${key("nameValidation2")}`)
        .required(`${key("nameValidation3")}`),
    [key]
  );

  const messageValidation = useMemo(
    () =>
      string()
        .min(5, key("min5"))
        .required(`${key("fieldReq")}`),
    [key]
  );

  return {
    mainReqValidation,
    phoneValidation,
    passwordValidation,
    confirmPasswordValidation,
    emailValidation,
    nameValidation,
    messageValidation,
  };
};

export default useValidation;
