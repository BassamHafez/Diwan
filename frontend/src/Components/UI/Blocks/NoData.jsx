import noDataImg from "../../../assets/noData.jpg";
import finishTasks from "../../../assets/finishTasks.jpg";
import styles from "./NoData.module.css";

const NoData = ({text,type}) => {
  return (
    <div className={styles.noData}>
      <img src={type==="tasks"?finishTasks:noDataImg} alt="noDataImg" />
      <span>{text}</span>
    </div>
  )
}

export default NoData
