import styles from "./Buttons.module.css";

const ButtonOne = ({ text, onClick, type, children,color,classes }) => {
  return (
    <button
      onClick={onClick}
      type={type ? type : "button"}
      className={`${styles.btn_one} ${color==="white"?styles.white_btn:''} ${classes}`}
    >
      {text ? text : children}
      <div className={styles.btn_one_layer}></div>
    </button>
  );
};

export default ButtonOne;
