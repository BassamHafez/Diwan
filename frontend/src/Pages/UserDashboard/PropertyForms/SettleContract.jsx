import { paymentMethodOptions } from "../../../Components/Logic/StaticLists";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { formattedDate } from "../../../Components/Logic/LogicFun";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../shared/index";
import {
  faSpinner,
  toast,
  object,
  string,
  date,
  number,
} from "../../../shared/constants";
import {
  useMutation,
  useQueryClient,
  useTranslation,
  useParams,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";

const SettleContract = ({
  contractDetails,
  refetch,
  refetchDetails,
  hideModal,
}) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { propId } = useParams();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";
  const requiredLabel = <span className="text-danger">*</span>;
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    paymentMethod: "",
    paidAt: formattedDate(new Date()),
    settlementAmount: "",
  };

  const onSubmit = (values, { resetForm }) => {
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "put",
            type: `estates/${propId}/contracts/${contractDetails?._id}/settle`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (data?.status === "success") {
                await refetch();
                await refetchDetails();
                await queryClient.invalidateQueries(["estates", token]);
                await queryClient.invalidateQueries(["compounds", token]);
                resetForm();
                resolve(key("setteledSucc"));
                hideModal();
              } else {
                reject();
              }
            },
            onError: (error) => {
              console.log(error);
              reject();
            },
          }
        );
      }),
      {
        pending: key(key("saving")),
        success: key("setteledSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    paymentMethod: string().required(key("fieldReq")),
    paidAt: date(),
    settlementAmount: number()
      .min(0, key("positiveOnlyValidation"))
      .required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <Form>
          <div className="field">
            <label htmlFor="settlementAmount">{key("settlementAmount")}</label>
            <Field
              type="number"
              id="settlementAmount"
              name="settlementAmount"
            />
            <ErrorMessage
              name="settlementAmount"
              component={InputErrorMessage}
            />
          </div>
          <div className="field">
            <label htmlFor="paymentMethod">
              {key("paymentMethod")} {requiredLabel}
            </label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              options={paymentMethodOptions[currentLang]}
              onChange={(val) => setFieldValue("paymentMethod", val.value)}
              className={`${isArLang ? "text-end" : "text-start"}`}
              isRtl={isArLang ? true : false}
              placeholder=""
            />
            <ErrorMessage name="paymentMethod" component={InputErrorMessage} />
          </div>

          <div className="field">
            <label htmlFor="paidAt">{key("paidAt")}</label>
            <Field type="date" id="paidAt" name="paidAt" />
            <ErrorMessage name="paidAt" component={InputErrorMessage} />
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
            <button onClick={hideModal} className="cancel_btn my-2">
              {key("cancel")}
            </button>

            <button className="submit_btn my-2" type="submit">
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("confirm")
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SettleContract;
