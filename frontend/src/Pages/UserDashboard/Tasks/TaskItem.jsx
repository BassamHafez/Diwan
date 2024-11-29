import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Tasks.module.css";
import {
  faCircle,
  faEdit,
  faSquareCheck,
  faTrashCan,
  faWrench,
  faBagShopping,
  faCircleQuestion,
  faCoins,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import { faBuilding, faBell } from "@fortawesome/free-regular-svg-icons";

const TaskItem = ({ task }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();

  let circleColor =
    task.priority === "high"
      ? "text-danger"
      : task.priority === "mid"
      ? "text-warning"
      : "text-success";

  const getTaskType = () => {
    let iconType = faCircleQuestion; // Default icon
    switch (task.taskType) {
      case "reminder":
        iconType = faBell;
        break;
      case "purchase":
        iconType = faBagShopping;
        break;
      case "maintenance":
        iconType = faWrench;
        break;
      case "other":
        iconType = faCircleQuestion;
        break;
      default:
        break;
    }
    return iconType;
  };

  return (
    <Col md={6} lg={4}>
      <div className={styles.task_item}>
        <div className={`${isArLang ? styles.flags_ar : styles.flags_en}`}>
          <FontAwesomeIcon
            title={key(task.taskType)}
            className="mx-2 text-secondary"
            icon={getTaskType()}
          />
          <FontAwesomeIcon
            title={key(task.priority)}
            className={`${circleColor} `}
            icon={faCircle}
          />
        </div>

        <div className={styles.task_header}>
          <h5 className="mb-2">{task.title}</h5>
          <span>
            <FontAwesomeIcon icon={faUser} className="text-secondary" />{" "}
            {task.contact}
          </span>
        </div>
        <hr />
        <h6>
          <FontAwesomeIcon icon={faBuilding} className="text-secondary" />{" "}
          {task.compound}
        </h6>
        <p className={styles.desc}>{task.description}</p>
        <hr className="w-50" />
        <div className={styles.controller}>
          <div>
            <span>
              <FontAwesomeIcon
                icon={faCoins}
                className={`${isArLang ? "ms-1" : "me-1"} color-main`}
              />{" "}
              {task.cost} {key("sarSmall")}
            </span>
          </div>
          <div>
            <FontAwesomeIcon
              title={key("delete")}
              className="text-danger"
              icon={faTrashCan}
            />
            <FontAwesomeIcon title={key("ediet")} icon={faEdit} />
            <FontAwesomeIcon
              title={key("finished")}
              className="text-success"
              icon={faSquareCheck}
            />
          </div>
        </div>
      </div>
    </Col>
  );
};

export default TaskItem;
