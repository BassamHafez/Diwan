
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




{/* <Col key={pack._id} md={6} xl={4} className="my-5">
<div
  className={`${styles.package} ${
    (pack.packageName === "Golden" || pack.packageName === "الذهب") &&
    styles.golden_package
  }`}
>
  <div className={styles.package_type}>
    <h3>
      {(pack.packageName === "Golden" ||
        pack.packageName === "الذهب") && (
        <FontAwesomeIcon className={styles.crown_icon} icon={faCrown} />
      )}{" "}
      {pack.packageName}
    </h3>
  </div>
  <div className={styles.price}>
    <span className={styles.price_number}>
      {pack.offerPrice}{" "}
      <span className={styles.price_type}>{pack.type}</span>
    </span>
    <span className={styles.del_price}>
      <del>{pack.originalPrice}</del>{" "}
      <span className={styles.price_type}>{pack.type}</span>
    </span>
  </div>
  <div className={styles.features}>
    <ul>
      {pack?.features?.map((feature) => (
        <li key={feature}>
          <FontAwesomeIcon
            className={`${styles.list_icon}`}
            icon={isArLang ? faCircleChevronLeft : faCircleChevronRight}
          />
          {feature}
        </li>
      ))}
    </ul>
  </div>
  <div className="text-center pt-4 pb-2">
    <ButtonThree
      // onClick={() => subscribtionHandler(pack._id)}
      color={
        pack.packageName === "Golden" || pack.packageName === "الذهب"
          ? undefined
          : "white"
      }
      text={key("orderPackage")}
    />
  </div>
</div>
</Col> */}
  

