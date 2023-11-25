
import { Col, Container, Row } from "react-bootstrap";
import {useLoaderData, useNavigate} from "react-router-dom";
import {IBoards, IBoardsCreate} from "interfaces/Boards.ts";
import BoardCard from "../../components/BoardCard/BoardCard.tsx";
import styles from './boards-page.module.scss';
import person from '../../images/person.svg';
import {useState} from "react";
import axios from "axios";
import {useTypedSelector} from "hooks/useTypedSelector.ts";

const BoardsPage = () => {
  const boards = useLoaderData() as IBoards[];
  const { currentToken } = useTypedSelector(state => state.auth)
  const [visibleInput, setVisibleInput] = useState(false)
  const [visibleButton, setVisibleButton] = useState(true)
  const [formData, setFormData] = useState<IBoardsCreate>({
    title: ''
  })
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = event.target
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }
  // Chunk the boards array into groups of 3
  const chunkedBoards: IBoards[][] = boards.reduce((result, item, index) => {
    const chunkIndex = Math.floor(index / 3);
    result[chunkIndex] = (result[chunkIndex] || []) as IBoards[];
    result[chunkIndex].push(item);
    return result;
  }, [] as IBoards[][]);

  const showInput = () => {
    setVisibleInput(!visibleInput);
    setVisibleButton(!visibleButton);
    formData.title = '';
  }

  const createBoard = async () => {
    let boardId = ''
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/board/create`, {
      title: formData.title
    }, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    }).then(res => {
      boardId = res.data.id
    })
    navigate(`/board/${boardId}`)
  }

  return (
    <Container className={styles.container}>
      <Row>
        <Col className={styles.title}>
          <img src={person} alt="person" />
          <h3>Personal Boards</h3>
        </Col>
      </Row>
      {chunkedBoards.map((chunk, rowIndex) => (
          <Row className={styles.row} key={rowIndex}>
            {chunk.map((item) => (
              <Col xl={4} md={4} className={styles.col} key={item.id}>
                <BoardCard id={item.id} title={item.title} userId={item.userId} />
              </Col>
            ))}
            { chunk.length < 3 ?
              <Col xl={4} md={4} className={styles.col}>
                <button style={!visibleButton ? {display: "none"}: {display: "block"}} onClick={showInput} className={styles.addButton} >Create new Board...</button>
                <div style={visibleInput ? { display: "flex" } : { display: "none" }} className={styles.addInputBlock}>
                  <input type={"text"} placeholder={'Title'} name={'title'} value={formData.title} onChange={handleChange} />
                  <div>
                    <button onClick={createBoard}>Create</button>
                    <button onClick={showInput}>Cancel</button>
                  </div>
                </div>
              </Col>
              : <></> }
          </Row>
      ))}
      { boards.length % 3 === 0 ? <Row className={styles.row}>
        <Col xl={4} md={4} className={styles.col}>
          <button style={!visibleButton ? {display: "none"}: {display: "block"}} onClick={showInput} className={styles.addButton} >Create new Board...</button>
          <div style={visibleInput ? { display: "flex" } : { display: "none" }} className={styles.addInputBlock}>
            <input type={"text"} placeholder={'Title'} name={'title'} value={formData.title} onChange={handleChange} />
            <div>
              <button onClick={createBoard}>Create</button>
              <button onClick={showInput}>Cancel</button>
            </div>
          </div>
        </Col>
      </Row> : <></>}
    </Container>
  );
};

export default BoardsPage;
