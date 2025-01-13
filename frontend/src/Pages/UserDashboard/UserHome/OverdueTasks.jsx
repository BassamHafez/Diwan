import TaskContent from "../Tasks/TaskContent";
import { convertISoIntoDate } from "../../../Components/Logic/LogicFun";
import { Col } from "../../../shared/bootstrap";
import { useMemo, useTranslation } from "../../../shared/hooks";
import styles from "./UserHome.module.css";

const OverdueTasks = ({ myData, refetch }) => {

  const { t: key } = useTranslation();
  console.log("OverdueTasks")
  const today = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
  const overdueTasks = useMemo(
    () =>
      myData?.todayAndBeforeTasks?.filter(
        (task) => convertISoIntoDate(task?.date) < today
      ),
    [myData, today]
  );

  const todayTasks = useMemo(
    () =>
      myData?.todayAndBeforeTasks?.filter(
        (task) => convertISoIntoDate(task?.date) === today
      ),
    [myData, today]
  );

  return (
    <>
      <Col sm={12}>
        <div className={styles.information_section}>
          <h4 className="fw-bold mb-4">{key("overdueTasks")}</h4>
          <TaskContent
            timeFilter="all"
            tagsFilter="all"
            typesFilter="all"
            tasks={{ data: overdueTasks }}
            refetch={refetch}
          />
        </div>
      </Col>
      <Col sm={12}>
        <div className={styles.information_section}>
          <h4 className="fw-bold mb-4">{key("todayTasks")}</h4>
          <TaskContent
            timeFilter="all"
            tagsFilter="all"
            typesFilter="all"
            tasks={{ data: todayTasks }}
            refetch={refetch}
          />
        </div>
      </Col>
    </>
  );
};

export default OverdueTasks;
