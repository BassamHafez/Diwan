import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "./Tasks.module.css";
import SearchField from "../../../Components/Search/SearchField";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faClipboard,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBagShopping,
  faCheckDouble,
  faCircle,
  faCirclePlus,
  faCircleQuestion,
  faClockRotateLeft,
  faCubes,
  faTag,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import TaskItem from "./TaskItem";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useState } from "react";
import AddTask from "./TaskForms/AddTask";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import NoData from "../../../Components/UI/Blocks/NoData";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";

const Tasks = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  let iconClass = isArLang ? "ms-2" : "me-2";
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: tasks, refetch } = useQuery({
    queryKey: ["tasks", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "tasks",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  return (
    <>
      <div className={`${styles.main_container} height_container`}>
        <Row style={{ minHeight: "65vh" }}>
          <Col sm={4} lg={3} xl={2} className="p-0">
            <div className={styles.filter_side}>
              <div className="small_filter">
                <h6>
                  <FontAwesomeIcon
                    className={`${iconClass}`}
                    icon={faClockRotateLeft}
                  />
                  {key("time")}
                </h6>
                <ul className={styles.filter_list}>
                  <li className={styles.active}>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClipboard}
                    />
                    {key("all")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faCirclePlus}
                    />
                    {key("underway")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClock}
                    />
                    {key("postponed")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faCheckDouble}
                    />
                    {key("finished")}
                  </li>
                </ul>

                <hr />
                <h6>
                  <FontAwesomeIcon className={`${iconClass}`} icon={faTag} />
                  {key("tag")}
                </h6>
                <ul className={styles.filter_list}>
                  <li className={styles.active}>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClipboard}
                    />
                    {key("all")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass} text-success ${styles.cirlce_color}`}
                      icon={faCircle}
                    />
                    {key("low")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass} text-warning ${styles.cirlce_color}`}
                      icon={faCircle}
                    />
                    {key("mid")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass} text-danger ${styles.cirlce_color}`}
                      icon={faCircle}
                    />
                    {key("high")}
                  </li>
                </ul>

                <hr />
                <h6>
                  <FontAwesomeIcon className={`${iconClass}`} icon={faCubes} />
                  {key("type")}
                </h6>
                <ul className={styles.filter_list}>
                  <li className={styles.active}>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClipboard}
                    />
                    {key("all")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faWrench}
                    />
                    {key("maintenance")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faBagShopping}
                    />
                    {key("purchase")}
                  </li>
                  <li>
                    <FontAwesomeIcon className={`${iconClass}`} icon={faBell} />
                    {key("reminder")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faCircleQuestion}
                    />
                    {key("other")}
                  </li>
                </ul>
              </div>
            </div>
          </Col>

          <Col sm={8} lg={9} xl={10}>
            <div className={`${styles.tasks_content} `}>
              <div
                className="d-flex justify-content-between align-items-center flex-wrap"
                style={{ height: "fit-content" }}
              >
                <div>
                  <SearchField text={key("searchTasks")} />
                </div>

                <div>
                  <ButtonOne
                    onClick={() => setShowAddTaskModal(true)}
                    text={`${key("add")} ${key("task")}`}
                    borderd={true}
                  />
                </div>
              </div>
              <Row className="mt-3 gy-3 position-relative" style={{minHeight:"50vh"}}>
                {tasks ? (
                  tasks.data.length > 0 ? (
                    tasks.data?.map((task) => (
                      <TaskItem key={task._id} task={task} refetch={refetch} />
                    ))
                  ) : (
                    <NoData type="tasks" text={key("noTasks")} />
                  )
                ) : (
                  <LoadingOne />
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      {showAddTaskModal && (
        <ModalForm
          show={showAddTaskModal}
          onHide={() => setShowAddTaskModal(false)}
          modalSize="lg"
        >
          <AddTask
            hideModal={() => setShowAddTaskModal(false)}
            refetch={refetch}
          />
        </ModalForm>
      )}
    </>
  );
};

export default Tasks;
