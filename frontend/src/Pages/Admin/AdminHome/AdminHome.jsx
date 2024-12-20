import styles from "./AdminHome.module.css";
import anlaysisImg from "../../../assets/analysis.jpg";

const AdminHome = () => {
  return (
    <div className="height_container d-flex flex-column justify-content-center align-items-center">
      <img className={styles.anlaysisImg} src={anlaysisImg} alt="anlaysisImg" />
      <span className="text-secondary">Analysis will be shown here</span>
    </div>
  );
};

export default AdminHome;
