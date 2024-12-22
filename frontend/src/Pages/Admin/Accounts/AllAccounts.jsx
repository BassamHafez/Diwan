import { useTranslation } from "react-i18next";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import styles from "../Admin.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import Accordion from "react-bootstrap/Accordion";
import AccordionContent from "../../../Components/UI/Tools/AccordionContent";
import AccountFeatures from "./AccountFeatures";

const AllAccounts = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { data: accounts, isFetching } = useQuery({
    queryKey: ["allAccounts", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "accounts",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  return (
    <div className="admin_body height_container p-2 position-relative">
      {(!accounts || isFetching) && <LoadingOne />}
      <div className="my-4">
        <MainTitle title={key("accounts")} />
      </div>

      <Row className="g-3">
        {accounts?.data?.length > 0 ? (
          accounts?.data?.map(
            (acc) =>
              acc.owner &&
              acc.name && (
                <Col key={acc._id} xl={4} md={6}>
                  <div className={styles.item}>
                    <h5 className="mb-3">{acc.name}</h5>

                    <div className="mb-4">
                      <Accordion>
                        <AccordionContent
                          title={key("officeInfo")}
                          eventKey="0"
                        >
                          <ul className={styles.details_list}>
                            <li>
                              <span>{key("name")}</span>
                              <span>{acc?.name || key("notExist")}</span>
                            </li>
                            <li>
                              <span>{key("phone")}</span>
                              <span>{acc?.phone || key("notExist")}</span>
                            </li>
                            <li>
                              <span>{key("region")}</span>
                              <span>{acc?.region || key("notExist")}</span>
                            </li>
                            <li>
                              <span>{key("city")}</span>
                              <span>{acc?.city || key("notExist")}</span>
                            </li>
                            <li>
                              <span>{key("address")}</span>
                              <span>{acc?.address || key("notExist")}</span>
                            </li>
                            <li>
                              <span>{key("taxNumber")}</span>
                              <span>{acc?.taxNumber || key("notExist")}</span>
                            </li>
                            <li>
                              <span>{key("commercialRecord")}</span>
                              <span>
                                {acc?.commercialRecord || key("notExist")}
                              </span>
                            </li>
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
                          <ul className={styles.details_list}>
                            <li>
                              <span>{key("name")}</span>
                              <span>{acc?.owner?.name || key("notExist")}</span>
                            </li>
                            <li style={{ wordBreak: "break-all" }}>
                              <span>{key("email")}</span>
                              <span>
                                {acc?.owner?.email || key("notExist")}
                              </span>
                            </li>
                            <li>
                              <span>{key("phone")}</span>
                              <span>
                                {acc?.owner?.phone || key("notExist")}
                              </span>
                            </li>
                          </ul>
                        </AccordionContent>
                      </Accordion>
                    </div>
                  </div>
                </Col>
              )
          )
        ) : (
          <NoData text={key("noAccounts")} />
        )}
      </Row>
    </div>
  );
};

export default AllAccounts;
