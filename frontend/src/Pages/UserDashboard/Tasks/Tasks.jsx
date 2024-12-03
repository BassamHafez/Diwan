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
  const [timeFilter, setTimeFilter] = useState("all");
  const [tagsFilter, setTagsFilter] = useState("all");
  const [typesFilter, setTypesFilter] = useState("all");

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

  const filteredTasks =
    tasks && Array.isArray(tasks.data)
      ? tasks.data.filter((task) =>
          (timeFilter === "all"
            ? true
            : timeFilter === "underway"
            ? !task.isCompleted
            : task.isCompleted) &&
          (tagsFilter === "all" ? true : task.priority === tagsFilter) &&
          typesFilter === "all"
            ? true
            : task.type === typesFilter
        )
      : [];

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
                  <li
                    className={timeFilter === "all" ? styles.active : ""}
                    onClick={() => setTimeFilter("all")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClipboard}
                    />
                    {key("all")}
                  </li>
                  <li
                    className={timeFilter === "underway" ? styles.active : ""}
                    onClick={() => setTimeFilter("underway")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClock}
                    />
                    {key("underway")}
                  </li>
                  <li
                    className={timeFilter === "finished" ? styles.active : ""}
                    onClick={() => setTimeFilter("finished")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass} text-success`}
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
                  <li
                    className={tagsFilter === "all" ? styles.active : ""}
                    onClick={() => setTagsFilter("all")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClipboard}
                    />
                    {key("all")}
                  </li>
                  <li
                    className={tagsFilter === "low" ? styles.active : ""}
                    onClick={() => setTagsFilter("low")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass} text-success ${styles.cirlce_color}`}
                      icon={faCircle}
                    />
                    {key("low")}
                  </li>
                  <li
                    className={tagsFilter === "mid" ? styles.active : ""}
                    onClick={() => setTagsFilter("medium")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass} text-warning ${styles.cirlce_color}`}
                      icon={faCircle}
                    />
                    {key("mid")}
                  </li>
                  <li
                    className={tagsFilter === "high" ? styles.active : ""}
                    onClick={() => setTagsFilter("high")}
                  >
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
                  <li
                    className={typesFilter === "all" ? styles.active : ""}
                    onClick={() => setTypesFilter("all")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClipboard}
                    />
                    {key("all")}
                  </li>
                  <li
                    className={
                      typesFilter === "maintenance" ? styles.active : ""
                    }
                    onClick={() => setTypesFilter("maintenance")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faWrench}
                    />
                    {key("maintenance")}
                  </li>
                  <li
                    className={typesFilter === "purchases" ? styles.active : ""}
                    onClick={() => setTypesFilter("purchases")}
                  >
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faBagShopping}
                    />
                    {key("purchases")}
                  </li>
                  <li
                    className={typesFilter === "reminder" ? styles.active : ""}
                    onClick={() => setTypesFilter("reminder")}
                  >
                    <FontAwesomeIcon className={`${iconClass}`} icon={faBell} />
                    {key("reminder")}
                  </li>
                  <li
                    className={typesFilter === "other" ? styles.active : ""}
                    onClick={() => setTypesFilter("other")}
                  >
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
            <div className={`${styles.tasks_content} position-relative`}>
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
              <Row
                className="mt-3 gy-3 position-relative"
                style={{ minHeight: "50vh" }}
              >
                {tasks ? (
                  filteredTasks?.length > 0 ? (
                    filteredTasks?.map((task) => (
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
