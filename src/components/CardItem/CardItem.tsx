import {ICardEdit, ICards, ICommentCreate} from "interfaces/Lists.ts";
import styles from './card-item.module.scss'
import {Accordion, Badge, Button, Modal} from "react-bootstrap";
import {ChangeEvent, useState} from "react";
import cardIcon from 'img/card.svg'
import commentIcon from 'img/comment.svg'
import activityIcon from 'img/activity_modal.svg'
import {useTypedSelector} from "hooks/useTypedSelector.ts";
import axios from "axios";
import {IActivity} from "interfaces/Activity.ts";

interface PropsType {
  card: ICards
  listTitle: string
  boardId: string
  setRender:  React.Dispatch<React.SetStateAction<boolean>>
  render: boolean
  listActivity: IActivity[]
}
const CardItem = ({card, listTitle, boardId, setRender, render, listActivity}: PropsType) => {
  const { currentToken, user } = useTypedSelector(state => state.auth);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [formData, setFormData] = useState<ICommentCreate>({
    text: ''
  })

  const [formDataCard, setFormDataCard] = useState<ICardEdit>({
    title: card.title,
    description: card.description
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleChangeCard = (event: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormDataCard((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const addComment = async () => {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/comment/create/${boardId}/${card.id}`,{
      text: formData.text
    },{
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    }).catch(err => console.log(err))
    setRender(!render)
    setFormData({text: ''})
  }

  const editCard = async () => {
    await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/card/update/${boardId}/${card.id}`,{
      title: formDataCard.title,
      description: formDataCard.description
    },{
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    }).catch(err => console.log(err))
    setRender(!render)
  }

  const deleteCard = async () => {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/card/delete/${boardId}/${card.id}`,{
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    }).catch(err => console.log(err))
    setRender(!render)
  }

  return (
    <div className={styles.card}>
      <button onClick={handleShow}>{card.title}</button>
      <Modal size={"xl"} className={styles.modal} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className={styles.header}>
              <img src={cardIcon} alt="cardIcon"/>
              <div>
                <h3>{card.title}</h3>
                <span>in list <i>{listTitle}</i></span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          <div className={styles.left}>
            <input placeholder={"Edit the description"} name={"description"} value={formDataCard.description} onChange={handleChangeCard} type="text"/>
            <div className={styles.comment_header}>
              <img src={commentIcon} alt="cardIcon"/>
              <h3>Add Comment</h3>
            </div>
            <div className={styles.comment_list}>
              {card.comments.map((item) => (
                <div>
                  <Badge bg={"#D6DADD"} className={styles.user}>
                    {item.user.username[0]}
                  </Badge>
                  <div>
                    <p>{item.text}</p>
                    <p>{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div>
                <Badge bg={"#D6DADD"} className={styles.user}>
                  {user.username[0]}
                </Badge>
                <div>
                  <textarea name={'text'} value={formData.text} onChange={handleChange} placeholder={"Write a comment"}/>
                  <Button onClick={addComment} variant="secondary">Save</Button>
                </div>
              </div>
            </div>
            <Accordion className={styles.activity_header}>
              <Accordion.Item eventKey={"0"}>
                <Accordion.Header>
                  <img src={activityIcon} alt="cardIcon"/>
                  <h3>Activity</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <div className={styles.list}>
                    {listActivity.map((item) => (
                      <div>
                        <Badge bg={"#D6DADD"} className={styles.user}>
                          {item.description[0]}
                        </Badge>
                        <div>
                          <span>{item.description}</span>
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className={styles.right}>
            <h3>Actions</h3>
            <Button onClick={deleteCard} variant="secondary">Remove</Button>
            <Button onClick={editCard} className={styles.save} variant="secondary">Save changes</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CardItem;