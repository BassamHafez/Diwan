import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useTranslation } from "react-i18next";
import EveryMonthPackage from "./PackagesTypes/EveryMonthPackage";
import EveryThreeMonthsPackage from "./PackagesTypes/EveryThreeMonthsPackage";
import EveryYearPackage from "./PackagesTypes/EveryYearPackage";
import { useQuery } from "@tanstack/react-query";
import { getPublicData } from "../../util/Http";
import LoadingOne from "../../Components/UI/Loading/LoadingOne";
import styles from "./Packages.module.css";

const Packages = () => {
  const { t: key } = useTranslation();

  const { data: packages, isFetching } = useQuery({
    queryKey: ["allPackages"],
    queryFn: () => getPublicData({ type: "packages" }),
    staleTime: Infinity,
  });

  return (
    <div
      style={{ backgroundColor: "#F7F7FC", overflowX: "hidden" }}
      className="py-4"
    >
      <Tabs defaultActiveKey="month" className="mb-3" fill>
        <Tab eventKey="month" title={key("month")}>
          <div className={styles.container}>
            {(!packages || isFetching) && <LoadingOne />}
            <EveryMonthPackage packages={packages} />
          </div>
        </Tab>
        <Tab eventKey="3month" title={key("3month")}>
          <div className={styles.container}>
            {(!packages || isFetching) && <LoadingOne />}
            <EveryThreeMonthsPackage packages={packages} />
          </div>
        </Tab>
        <Tab eventKey="6month" title={key("6month")}>
          <div className={styles.container}>
            {(!packages || isFetching) && <LoadingOne />}
            <EveryThreeMonthsPackage packages={packages} />
          </div>
        </Tab>
        <Tab eventKey="year" title={key("year")}>
          <div className={styles.container}>
            {(!packages || isFetching) && <LoadingOne />}
            <EveryYearPackage packages={packages} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Packages;
