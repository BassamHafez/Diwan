import styles from "./Packages.module.css";
import PackagesTab from "./PackagesTab";
import { Tab, Tabs } from "../../shared/bootstrap";
import { useTranslation, useFilterPackagesDuration } from "../../shared/hooks";
import { LoadingOne } from "../../shared/components";

const Packages = () => {
  const { t: key } = useTranslation();
  const {
    packages,
    monthlyPackages,
    threeMonthsPackage,
    sixMonthsPackage,
    yearlyPackage,
    isFetching,
  } = useFilterPackagesDuration();

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
