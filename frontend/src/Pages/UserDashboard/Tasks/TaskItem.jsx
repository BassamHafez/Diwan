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
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import UpdateTask from "./TaskForms/UpdateTask";
import { useState } from "react";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { useSelector } from "react-redux";
import { mainDeleteFunHandler } from "../../../util/Http";
import { toast } from "react-toastify";

const TaskItem = ({ task, refetch }) => {
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskData, setTaskData] = useState({});
  const token = useSelector((state) => state.userInfo.token);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

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

  const deleteTask = async () => {
    setShowDeleteModal(false);
    if (taskData._id && token) {
      const res = await mainDeleteFunHandler({
        id: taskData._id,
        token: token,
        type: `tasks`,
      });
      if (res.status === 204) {
        refetch();
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  return (
    <>
      <Col md={6} xl={4}>
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
                onClick={() => setShowDeleteModal(true)}
              />
              <FontAwesomeIcon
                onClick={() => {
                  setTaskData(task);
                  setShowUpdateTaskModal(true);
                }}
                title={key("ediet")}
                icon={faEdit}
              />
              <FontAwesomeIcon
                title={key("finished")}
                className="text-success"
                icon={faSquareCheck}
              />
            </div>
          </div>
        </div>
      </Col>

      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteTask}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
      {showUpdateTaskModal && (
        <ModalForm
          show={showUpdateTaskModal}
          onHide={() => setShowUpdateTaskModal(false)}
          modalSize="lg"
        >
          <UpdateTask
            hideModal={() => setShowUpdateTaskModal(false)}
            // refetch={refetch}
            task={taskData}
          />
        </ModalForm>
      )}
    </>
  );
};

export default TaskItem;
