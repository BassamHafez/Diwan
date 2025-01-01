import { useTranslation } from "react-i18next";
import styles from "./PrintContract.module.css";
import PrintNavBar from "./PrintNavBar";
import ReportsDetailsHeader from "./ReportsDetailsHeader";

const PrintContractsReport = ({
  id,
  contractsData,
  dataEnteried,
  isCompoundDetails,
  compoundDetailsTable,
  operationalTable,
}) => {
  const { t: key } = useTranslation();

  const totalAmount = !isCompoundDetails
    ? contractsData?.reduce(
        (sum, contract) => sum + (contract.totalAmount || 0),
        0
      )
    : 0;

  return (
    <div className={styles.container_body} id={id}>
      <PrintNavBar
        title={
          isCompoundDetails
            ? key("compoundDetailsReport")
            : key("contractsReport")
        }
      />

      <ReportsDetailsHeader dataEnteried={dataEnteried} />

      <div className={styles.information}>
        <h5 className="my-4">
          {isCompoundDetails ? key("compound") : key("incomePerEstate")}
        </h5>
        <div className="scrollableTable">
          {compoundDetailsTable && isCompoundDetails
            ? compoundDetailsTable
            : operationalTable}
        </div>

        {!isCompoundDetails && (
          <p className="my-4 fw-bold">
            {key("totalAmount")} : {totalAmount} {key("sar")}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrintContractsReport;
