import anlaysisImg from "../../../assets/analysis.jpg";
import styles from "./UserHome.module.css"
const UserHome = () => {
  return (
    <div className="height_container d-flex flex-column justify-content-center align-items-center">
      <img className={styles.anlaysisImg} src={anlaysisImg} alt="anlaysisImg"/>
      <span>Analysis will be shown here</span>
    </div>
  );
};

export default UserHome;
