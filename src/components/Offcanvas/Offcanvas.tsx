import styles from "./offcanvas.module.scss";
import activityImg from "img/activity.svg";
import {Badge, Offcanvas} from "react-bootstrap";
import axios from "axios";
import {IActivity} from "interfaces/Activity.ts";
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "hooks/useTypedSelector.ts";

interface PropsType {
  show: boolean,
  handleClose: () => void,
  userId: string,
  boardUserId: string,
  boardId: string,
  activityData: IActivity[],
  activity: IActivity[],
}

const OffcanvasEll = ({show, handleClose, userId, boardUserId, activityData, activity, boardId} : PropsType) => {
  const { currentToken } = useTypedSelector(state => state.auth);
  const navigate = useNavigate();

  const removeBoard = async () => {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/board/delete/${boardId}`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    })
    navigate('/board');
  }

  return (
    <Offcanvas className={styles.offcanvas} placement={"end"} backdrop={false} show={show} onHide={handleClose}>
      <Offcanvas.Header className={styles.offcanvas_header} closeButton>
        <Offcanvas.Title className={styles.offcanvas_title}>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className={styles.offcanvas_body}>
        <div style={userId !== boardUserId ? {display: "none"} : {}} className={styles.remove}>
          <button onClick={removeBoard}>Remove board</button>
        </div>
        <div className={styles.activity}>
          <div>
            <img src={activityImg} alt="activityImg"/>
            <span>Activity</span>
          </div>
          <div className={styles.list}>
            {activityData.length === 0 ? activity.map((item) => (
              <div>
                <Badge bg={"#D6DADD"} className={styles.user}>
                  {item.description[0]}
                </Badge>
                <div>{item.description}</div>
              </div>
            )) : activityData.map((item) => (
              <div>
                <Badge bg={"#D6DADD"} className={styles.user}>
                  {item.description[0]}
                </Badge>
                <div>{item.description}</div>
              </div>))}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvasEll;