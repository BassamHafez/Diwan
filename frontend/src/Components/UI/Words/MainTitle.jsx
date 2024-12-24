import styles from "./MainTitle.module.css";

const MainTitle = ({title,children,small}) => {
  return (
    <h5 className={`${styles.main_title} ${small?"fs-6":""}`}>
      {title?title:children}
    </h5>
  )
}

export default MainTitle
