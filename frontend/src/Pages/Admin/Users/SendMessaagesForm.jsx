import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../shared/index";
import {
  faEnvelope,
  faSquareWhatsapp,
  toast,
  object,
} from "../../../shared/constants";
import {
  useMutation,
  useSelector,
  useTranslation,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";

const SendMessaagesForm = ({
  selectedUsers,
  allUsers,
  clearSelectedUsersIds,
  hideModal,
}) => {
  const { t: key } = useTranslation();
  const { messageValidation, mainReqValidation } = useValidation();
  const token = useSelector((state) => state.userInfo.token);
  const { mutate } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    message: "",
    type: "email",
  };

  const onSubmit = (values, { resetForm }) => {
    const myIds = selectedUsers?.length > 0 ? selectedUsers : allUsers;
    const updatedValues = { ...values, usersIds: myIds };
    console.log(updatedValues);
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "add",
            type: "users/messages",
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                clearSelectedUsersIds();
                resolve(key("sentSuccess"));
                resetForm();
                hideModal();
              } else {
                reject(key("wrong"));
              }
            },
            onError: (error) => {
              console.log(error);
              reject(key("wrong"));
            },
          }
        );
      }),
      {
        pending: key(key("sending")),
        success: key("sentSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    message: messageValidation,
    type: mainReqValidation,
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <div className="field">
          <label htmlFor="message">{key("message")}</label>
          <Field
            as="textarea"
            className="text_area"
            id="message"
            name="message"
          />
          <ErrorMessage name="message" component={InputErrorMessage} />
        </div>
        <div className="d-flex flex-column align-items-start my-4">
          <h6>{key("sendingMethod")}</h6>
          <div className="btn-group flex-wrap my-3">
            <Field
              type="radio"
              name="type"
              value="email"
              id="email_val"
              className="btn-check"
            />
            <label
              htmlFor="email_val"
              className="btn btn-outline-dark m-2 rounded"
            >
              <FontAwesomeIcon className="mx-1" icon={faEnvelope} />{" "}
              {key("email")}
            </label>

            <Field
              type="radio"
              name="type"
              value="whatsapp"
              id="whatsapp_val"
              className="btn-check"
            />
            <label
              htmlFor="whatsapp_val"
              className="btn btn-outline-dark m-2 rounded"
            >
              <FontAwesomeIcon className="mx-1" icon={faSquareWhatsapp} />{" "}
              {key("WHATSAPP")}
            </label>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn my-2" type="submit">
            {key("send")}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default SendMessaagesForm;
