import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Loading.module.css'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const LoadingOne = () => {
  return (
    <div className={styles.loading}>
        <FontAwesomeIcon className="fa-spin" icon={faSpinner}/>
    </div>
  )
}

export default LoadingOne
