import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import styles from "../Admin.module.css";

import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import PolicyList from "../../../Components/UI/Blocks/PolicyList";
import SubscriptionItem from "./SubscriptionItem";

const AllSubscriptions = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const {
    data: subscriptions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["subscriptions", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "subscriptions",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const policyList = [
    { label: "subCondition1", value: null },
    { label: "subCondition2", value: null },
    { label: "subCondition3", value: null },
  ];

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {(!subscriptions || isFetching) && <LoadingOne />}
        <div className="my-4">
          <MainTitle title={key("subscriptions")} />
        </div>

        <div className="my-4">
          <Row>
            <Col xl={7} lg={6} className="py-4">
              <PolicyList list={policyList} />
            </Col>
            <Col xl={5} lg={6}>
              {subscriptions ? (
                subscriptions?.data?.length > 0 ? (
                  <div className="scrollableTable">
                    <table className={`${styles.contract_table} table`}>
                      <thead className={styles.table_head}>
                        <tr>
                          <th className={isArLang ? "text-end" : "text-start"}>
                            {key("features")}
                          </th>
                          <th>
                            {key("price")} ({key("sarSmall")})
                          </th>
                          <th>{key("actions")}</th>
                        </tr>
                      </thead>

                      <tbody className={styles.table_body}>
                        {subscriptions?.data?.map((sub, index) => (
                          <SubscriptionItem
                            key={`${sub.feature}_${index}`}
                            refetch={refetch}
                            sub={sub}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <NoData text={key("noData")} smallSize={true} />
                )
              ) : (
                <LoadingOne />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default AllSubscriptions;
