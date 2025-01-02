import noDataImg from "../../../assets/noData.webp";
import finishTasks from "../../../assets/finishTasks.jpg";
import noExpenses from "../../../assets/noExpenses.webp";
import estate from "../../../assets/estate.webp";
import support from "../../../assets/svg/support.svg";

import styles from "./NoData.module.css";

const NoData = ({text,type,smallSize}) => {
  let myImage=noDataImg;
  switch (type) {
    case "tasks":
      myImage=finishTasks
      break;
    case "expenses":
      myImage=noExpenses
      break;
    case "estate":
      myImage=estate
      break;
    case "support":
      myImage=support
      break;

    default:
      myImage=noDataImg
      break;
  }

  return (
    <div className={`${styles.noData} ${smallSize?styles.small_size:styles.medium_size}`}>
      <img src={myImage} alt="noDataImg" />
      <span>{text}</span>
    </div>
  )
}

export default NoData
