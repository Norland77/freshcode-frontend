import styles from './board-card.module.scss'
import {useTypedSelector} from "hooks/useTypedSelector.ts";
import {Link} from "react-router-dom";

interface PropsType {
  id: string
  title: string
  userId: string
}
const BoardCard = ({id, title, userId}: PropsType) => {
  const { user } = useTypedSelector(state => state.auth)

  return (
    <Link to={`/board/${id}`} className={styles.board}>
      <span>{title}</span>
      { user.id === userId ? <div className={styles.dot}></div> : <></>}
    </Link>
  );
};

export default BoardCard;