import {useLoaderData, useNavigate} from "react-router-dom";
import {ILists} from "interfaces/Lists.ts";
import {Badge, Button, CloseButton, Col, Container, Offcanvas, Row} from "react-bootstrap";
import ListItem from "../../components/ListItem/ListItem.tsx";
import {IBoards, IBoardsCreate} from "interfaces/Boards.ts";
import styles from './board-page.module.scss'
import {ChangeEvent, useEffect, useState} from "react";
import {listsLoader} from "../../loaders/listsLoader.ts";
import {useTypedSelector} from "hooks/useTypedSelector.ts";
import axios from "axios";
import activityImg from 'img/activity.svg'
import {IActivity} from "interfaces/Activity.ts";
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

const BoardPage = () => {
  const { lists, board, activity } = useLoaderData() as { lists: ILists[], board: IBoards, activity: IActivity[] };
  const { currentToken, user } = useTypedSelector(state => state.auth);
  const [listsData, setListsData] = useState(lists);
  const [render, setRender] = useState(true);
  const [visibleInput, setVisibleInput] = useState(false)
  const [visibleButton, setVisibleButton] = useState(true)
  const [activityData, setActivityData] = useState(activity)
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IBoardsCreate>({
    title: ''
  })

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  let chunkedBoards: ILists[][];
  if (listsData.length === 0) {
    chunkedBoards = lists.reduce((result, item, index) => {
      const chunkIndex = Math.floor(index / 3);
      result[chunkIndex] = (result[chunkIndex] || []) as ILists[];
      result[chunkIndex].push(item);

      return result;
    }, [] as ILists[][]);
  } else {
    chunkedBoards = listsData.reduce((result, item, index) => {
      const chunkIndex = Math.floor(index / 3);
      result[chunkIndex] = (result[chunkIndex] || []) as ILists[];
      result[chunkIndex].push(item);

      return result;
    }, [] as ILists[][]);
  }


  const showInput = () => {
    setVisibleInput(!visibleInput);
    setVisibleButton(!visibleButton);
    formData.title = '';
  }

  useEffect(() => {
    listsLoader(board.id, currentToken).then(value => {
      setListsData(value.lists)
      setActivityData(value.activity)
      if (value.lists.length === 0) {
        lists.length = 0;
      }
    })
  }, [render]);

  const createList = async () => {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/list/create/${board.id}`, {
      title: formData.title
    }, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    })
    setRender(!render);
    showInput()
  }

  const removeBoard = async () => {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/board/delete/${board.id}`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    })
    navigate('/board');
  }

  async function handleOnDragEnd(result: any) {
    await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/card/move/${board.id}/${result.draggableId}/${result.destination.droppableId}`, {

    },{
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    })

    setRender(!render)
  }

  return (
    <div className={styles.bg}>
      <Container>
        <Row className={styles.header}>
          <Col xl={2} className={styles.title}>{board.title}</Col>
          <Col xl={2} className={styles.buttonBlock}>
            <button onClick={handleShow}>Show menu</button>
          </Col>
        </Row>
        <Offcanvas className={styles.offcanvas} placement={"end"} backdrop={false} show={show} onHide={handleClose}>
          <Offcanvas.Header className={styles.offcanvas_header} closeButton>
            <Offcanvas.Title className={styles.offcanvas_title}>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className={styles.offcanvas_body}>
            <div style={user.id !== board.userId ? {display: "none"} : {}} className={styles.remove}>
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
        {chunkedBoards.map((chunk, rowIndex) => (
          <Row className={styles.row} key={rowIndex}>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              {chunk.map((item) => (
                <Droppable droppableId={item.id}>
                  {(provided) => (
                    <Col xl={4} key={item.id} {...provided.droppableProps} ref={provided.innerRef}>
                      <ListItem setRender={setRender} render={render} boardId={board.id} listId={item.id} title={item.title} cards={item.cards} listActivity={activity}></ListItem>
                    </Col>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
            
            {chunk.length < 3
              ? <Col sm={3} className={styles.addInput}>
                <button style={!visibleButton ? {display: "none"}: {display: "block"}} onClick={showInput}>Add a list...</button>
                <div style={visibleInput ? { display: "flex" } : { display: "none" }} className={styles.addInputBlock}>
                  <input type={"text"} placeholder={'Title'} name={'title'} value={formData.title} onChange={handleChange} />
                  <div>
                    <Button type={"reset"} className={styles.addButton} onClick={createList}>Add</Button>
                    <CloseButton onClick={showInput}></CloseButton>
                  </div>
                </div>
              </Col> : <></>}
          </Row>
        ))}
        {listsData.length === 0 ? lists.length % 3 === 0 ? <Row className={styles.row}>
          <Col sm={3} className={styles.addInput}>
            <button style={!visibleButton ? {display: "none"}: {display: "block"}} onClick={showInput}>Add a list...</button>
            <div style={visibleInput ? { display: "flex" } : { display: "none" }} className={styles.addInputBlock}>
              <input type={"text"} placeholder={'Title'} name={'title'} value={formData.title} onChange={handleChange} />
              <div>
                <Button type={"reset"} className={styles.addButton} onClick={createList}>Add</Button>
                <CloseButton onClick={showInput}></CloseButton>
              </div>
            </div>
          </Col>
        </Row> : <></> : listsData.length % 3 === 0 ? <Row className={styles.row}>
          <Col sm={3} className={styles.addInput}>
            <button style={!visibleButton ? {display: "none"}: {display: "block"}} onClick={showInput}>Add a list...</button>
            <div style={visibleInput ? { display: "flex" } : { display: "none" }} className={styles.addInputBlock}>
              <input type={"text"} placeholder={'Title'} name={'title'} value={formData.title} onChange={handleChange} />
              <div>
                <Button type={"reset"} className={styles.addButton} onClick={createList}>Add</Button>
                <CloseButton onClick={showInput}></CloseButton>
              </div>
            </div>
          </Col>
        </Row> : <></>}
      </Container>
    </div>
  );
};

export default BoardPage;