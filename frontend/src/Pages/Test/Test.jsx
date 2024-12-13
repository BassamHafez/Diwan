
// import styles from "./Packages.module.css";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import { useTranslation } from "react-i18next";
// import PackageItem from "./PackageItem";
// import { packagesList } from "../../Components/Logic/StaticLists";
const Test = () => {
  return (
    <div style={{ backgroundColor: "#F7F7FC", overflowX:"hidden" }} className="py-5">
      {/* <div className={styles.container}>
        <Tabs
          defaultActiveKey="three"
          className="my-3"
          fill
        >
          <Tab eventKey="month" title={key("month")}>
            <Row className="justify-content-center">
              {(isArLang
                ? packagesList.packagePerMonthAr
                : packagesList.packagesPerMonthEn
              ).map((pack,index) => (
                <PackageItem key={`${pack._id}_${index}`} pack={pack} />
              ))}
            </Row>
          </Tab>

          <Tab eventKey="three" title={key("3month")}>
            <Row className="justify-content-center">
              {(isArLang
                ? packagesList.packagePerThreeMonthsAr
                : packagesList.packagePerThreeMonthsEn
              ).map((pack,index) => (
                <PackageItem key={`${pack._id}_${index}`} pack={pack} />
              ))}
            </Row>
          </Tab>

          <Tab eventKey="year" title={key("year")}>
            <Row className="justify-content-center">
              {(isArLang
                ? packagesList.packagePerYearAr
                : packagesList.packagePerYearEn
              ).map((pack,index) => (
                <PackageItem key={`${pack._id}_${index}`} pack={pack} />
              ))}
            </Row>
          </Tab>
        </Tabs>
      </div> */}
    </div>
  )
}

export default Test





  

