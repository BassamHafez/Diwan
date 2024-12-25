import styles from "../Admin.module.css";
import Accordion from "react-bootstrap/Accordion";
import AccordionContent from "../../../Components/UI/Tools/AccordionContent";
import AccountFeatures from "./AccountFeatures";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { useState } from "react";
import { mainDeleteFunHandler } from "../../../util/Http";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AccountItem = ({ acc ,refetch}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const deleteAccount = async () => {
    setShowDeleteModal(false);

    if (acc?._id && token) {
      const res = await mainDeleteFunHandler({
        id: acc?._id,
        token: token,
        type: `accounts`,
      });

      if (res.status === 204) {
        refetch();
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const displayValue = (value) => value || key("notExist");

  const DetailsList = ({ items }) => (
    <ul className={styles.details_list}>
      {items.map(([label, value], index) => (
        <li key={index}>
          <span>{key(label)}</span>
          <span>{displayValue(value)}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Col xl={4} md={6}>
        <div className={styles.item}>
          <h5 className="mb-3">{acc.name}</h5>

          <div className="mb-4">
            <Accordion>
              <AccordionContent title={key("officeInfo")} eventKey="0">
                <ul className={styles.details_list}>
                  <DetailsList
                    items={[
                      ["name", acc?.name],
                      ["phone", acc?.phone],
                      ["region", acc?.region],
                      ["city", acc?.city],
                      ["address", acc?.address],
                      ["taxNumber", acc?.taxNumber],
                      ["commercialRecord", acc?.commercialRecord],
                    ]}
                  />
                </ul>
              </AccordionContent>
            </Accordion>
          </div>

          <div className={`${styles.features} mb-4`}>
            <Accordion>
              <AccordionContent title={key("features")} eventKey="0">
                <AccountFeatures account={acc} />
              </AccordionContent>
            </Accordion>
          </div>

          <div className="mb-4">
            <Accordion>
              <AccordionContent title={key("ownerInfo")} eventKey="0">
                <DetailsList
                  items={[
                    ["name", acc?.owner?.name],
                    ["email", acc?.owner?.email],
                    ["phone", acc?.owner?.phone],
                  ]}
                />
              </AccordionContent>
            </Accordion>
          </div>

          <div className="positon-relative d-flex justify-content-end">
            <ButtonOne onClick={()=>setShowDeleteModal(true)} borderd={true} classes="bg-danger" text={key("delete")} />
          </div>
        </div>
      </Col>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteAccount}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
    </>
  );
};

export default AccountItem;
