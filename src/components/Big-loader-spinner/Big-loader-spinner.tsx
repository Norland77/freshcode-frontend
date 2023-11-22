import { type FC } from 'react'
import {Spinner} from "react-bootstrap";
import styles from './big-loader-spinner.module.scss'
const BigLoaderSpinner: FC = () => {
  return (
    <div className={styles.spinnerStyle}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

export default BigLoaderSpinner
