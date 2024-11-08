import styles from "./MainTitle.module.css";

const MainTitle = ({title,children}) => {
  return (
    <h5 className={styles.main_title}>
      {title?title:children}
    </h5>
  )
}

export default MainTitle
