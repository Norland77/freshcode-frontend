import { type FC } from 'react'
import {Spinner} from "react-bootstrap";

const BigLoaderSpinner: FC = () => {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
}

export default BigLoaderSpinner
