import noDataImg from "../../../assets/noData.jpg";
import styles from "./NoData.module.css";

const NoData = ({text}) => {
  return (
    <div className={styles.noData}>
      <img src={noDataImg} alt="noDataImg" />
      <span>{text}</span>
    </div>
  )
}

export default NoData
