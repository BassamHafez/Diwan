import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPublicData } from "../../util/Http";
import LoadingOne from "../../Components/UI/Loading/LoadingOne";
import styles from "./Packages.module.css";
import PackagesTab from "./PackagesTab";

const Packages = () => {
  const { t: key } = useTranslation();

  const { data: packages, isFetching } = useQuery({
    queryKey: ["allPackages"],
    queryFn: () => getPublicData({ type: "packages" }),
    staleTime: Infinity,
  });

  const packagesData = packages?.data;

  const filterPackagesByDuration = (packages, duration) =>
    packages?.filter((pack) => pack.duration === duration);

  const monthlyPackages = filterPackagesByDuration(packagesData, 1);
  const threeMonthsPackage = filterPackagesByDuration(packagesData, 3);
  const sixMonthsPackage = filterPackagesByDuration(packagesData, 6);
  const yearlyPackage = filterPackagesByDuration(packagesData, 12);

  return (
    <div
      style={{ backgroundColor: "#F7F7FC", overflowX: "hidden" }}
      className="py-4"
    >
      {(!packages || isFetching) && <LoadingOne />}
      <Tabs defaultActiveKey="month" className="mb-3" fill>
        <Tab eventKey="month" title={key("month")}>
          <div className={styles.container}>
            <PackagesTab packages={monthlyPackages} />
          </div>
        </Tab>
        <Tab eventKey="3month" title={key("3month")}>
          <div className={styles.container}>
            <PackagesTab packages={threeMonthsPackage} />
          </div>
        </Tab>
        <Tab eventKey="6month" title={key("6month")}>
          <div className={styles.container}>
            <PackagesTab packages={sixMonthsPackage} />
          </div>
        </Tab>
        <Tab eventKey="year" title={key("year")}>
          <div className={styles.container}>
            <PackagesTab packages={yearlyPackage} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Packages;
