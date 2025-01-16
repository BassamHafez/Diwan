import {
  noDataImg,
  finishTasks,
  noExpenses,
  estate,
  support,
  upgrade,
} from "../../../shared/images";

import styles from "./NoData.module.css";

const NoData = ({ text, type, smallSize }) => {
  let myImage = noDataImg;
  switch (type) {
    case "tasks":
      myImage = finishTasks;
      break;
    case "expenses":
      myImage = noExpenses;
      break;
    case "estate":
      myImage = estate;
      break;
    case "support":
      myImage = support;
      break;
    case "upgrade":
      myImage = upgrade;
      break;

    default:
      myImage = noDataImg;
      break;
  }

  return (
    <div
      className={`${styles.noData} ${
        smallSize ? styles.small_size : styles.medium_size
      }`}
    >
      <img src={myImage} alt="noDataImg" />
      <span>{text}</span>
    </div>
  );
};

export default NoData;
