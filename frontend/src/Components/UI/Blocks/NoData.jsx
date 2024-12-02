import noDataImg from "../../../assets/noData.jpg";
import finishTasks from "../../../assets/finishTasks.jpg";
import noExpenses from "../../../assets/noExpenses.png";

import styles from "./NoData.module.css";

const NoData = ({text,type}) => {
  let myImage=noDataImg;
  switch (type) {
    case "tasks":
      myImage=finishTasks
      break;
    case "expenses":
      myImage=noExpenses
      break;

    default:
      myImage=noDataImg
      break;
  }

  return (
    <div className={styles.noData}>
      <img src={myImage} alt="noDataImg" />
      <span>{text}</span>
    </div>
  )
}

export default NoData
