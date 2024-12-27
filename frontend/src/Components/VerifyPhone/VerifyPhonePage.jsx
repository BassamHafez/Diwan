import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import ModalForm from "../UI/Modals/ModalForm";
import VerifyPhoneForm from "./VerifyPhoneForm";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonOne from "../UI/Buttons/ButtonOne";
import verifiedImage from "../../assets/verified.jpg";
import MainTitle from "../UI/Words/MainTitle";
import { useNavigate } from "react-router-dom";

const VerifyPhonePage = () => {
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);

  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const navigate=useNavigate();

  useEffect(()=>{
    if(profileInfo?.phoneVerified===true){
      navigate(-1)
    }
  },[profileInfo?.phoneVerified,navigate]);

  const verifyPhoneNumber = async () => {
    const response = await mainFormsHandlerTypeRaw({
      type: "users/phone-wa-code",
      token: token,
    });
    if (response.status === "success") {
      notifySuccess(key("checkWhatsApp"));
      setShowVerifyCodeModal(true);
    } else {
      notifyError(key("sendCodeFail"));
    }
  };
  const mainCenterClass =
    "d-flex justify-content-center align-items-center flex-column";

  return (
    <>
      <div
        style={{ backgroundColor: "var(--sky)" }}
        className={`${mainCenterClass} height_container p-4`}
      >
        <div
          style={{
            borderRadius: "40px",
            boxShadow: "0 3px 3px rgba(0,0,0,.2)",
            borderTop: "1px solid rgba(255,255,255,.7)",
          }}
          className="bg-white p-4"
        >
          <Row>
            <Col md={6} className={mainCenterClass}>
              <div className="text-center">
                <div className="mb-3">
                  <MainTitle title={key("phoneVerification")} />
                </div>
                <h5 style={{ lineHeight: "2" }} className="my-2">
                  {key("phoneVerifyFirst")}
                  <FontAwesomeIcon
                    className="text-success mx-2"
                    icon={faWhatsapp}
                  />
                </h5>
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <ButtonOne
                    classes="bg-warning text-black"
                    onClick={verifyPhoneNumber}
                    borderd={true}
                  >
                    {key("send")}
                  </ButtonOne>
                </div>
              </div>
            </Col>
            <Col md={6} className={mainCenterClass}>
              <div className="standard_img">
                <img
                  className="w-100"
                  src={verifiedImage}
                  alt="verifiedImage"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {showVerifyCodeModal && (
        <ModalForm
          show={showVerifyCodeModal}
          onHide={() => setShowVerifyCodeModal(false)}
          modalSize={"md"}
        >
          <VerifyPhoneForm hideModal={() => setShowVerifyCodeModal(false)} />
        </ModalForm>
      )}
    </>
  );
};

export default VerifyPhonePage;
