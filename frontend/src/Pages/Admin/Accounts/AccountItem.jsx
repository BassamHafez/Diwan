import styles from "../Admin.module.css";
import Accordion from "react-bootstrap/Accordion";
import AccordionContent from "../../../Components/UI/Tools/AccordionContent";
import AccountFeatures from "./AccountFeatures";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { useCallback, useState } from "react";
import useDeleteItem from "../../../hooks/useDeleteItem";

const AccountItem = ({ acc, refetch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteItem = useDeleteItem();

  const { t: key } = useTranslation();

  const deleteAccount = async () => {
    setShowDeleteModal(false);
    const formData = {
      itemId: acc?._id,
      endPoint: `accounts`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    deleteItem(formData);
  };

  const displayValue = useCallback((value) => value || key("notExist"), [key]);

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

  const hideDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const showDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

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
            <ButtonOne
              onClick={showDeleteModalHandler}
              borderd={true}
              classes="bg-danger"
              text={key("delete")}
            />
          </div>
        </div>
      </Col>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={hideDeleteModalHandler}
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
