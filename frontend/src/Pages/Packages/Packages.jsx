import Row from "react-bootstrap/Row";
import styles from "./Packages.module.css";
import PackageItem from "./PackageItem";
import { package1, package2, package3 } from "../../Components/Logic/StaticLists";

const Packages = () => {

  return (
    <div style={{ backgroundColor: "#F7F7FC", overflowX:"hidden" }} className="py-5">
      <div className={styles.container}>
        <Row>
          <PackageItem pack={package1} type={"pack1"}/>
          <PackageItem pack={package2} type={'pack2'}/>
          <PackageItem pack={package3} type={'custom'}/>
        </Row>
      </div>
    </div>
  );
};

export default Packages;
