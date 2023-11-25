import {Button, ButtonGroup, CloseButton, Dropdown, DropdownButton, ListGroup} from "react-bootstrap";
import {ICards} from "interfaces/Lists.ts";
import styles from './list-item.module.scss'
import {ChangeEvent, KeyboardEvent, useState} from "react";
import {IBoardsCreate} from "interfaces/Boards.ts";
import axios from "axios";
import {useTypedSelector} from "hooks/useTypedSelector.ts";
import CardItem from "../CardItem/CardItem.tsx";
import {IActivity} from "interfaces/Activity.ts";
import {Draggable} from "react-beautiful-dnd";
interface PropsType {
  title: string
  cards: ICards[]
  listId: string
  boardId: string
  setRender:  React.Dispatch<React.SetStateAction<boolean>>
  render: boolean
  listActivity: IActivity[]
}
const ListItem = ({title, cards, listId, boardId, setRender, render, listActivity}: PropsType) => {
  const { currentToken } = useTypedSelector(state => state.auth)
  const [visibleInput, setVisibleInput] = useState(false)
  const [visibleButton, setVisibleButton] = useState(true)
  const [visibleTitleInput, setVisibleTitleInput] = useState(false)
  const [visibleTitleButton, setVisibleTitleButton] = useState(true)
  const [formData, setFormData] = useState<IBoardsCreate>({
    title: ''
  })
  const [formDataTitle, setFormDataTitle] = useState<IBoardsCreate>({
    title: title
  })
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }
  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormDataTitle((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const showInput = () => {
    setVisibleInput(!visibleInput);
    setVisibleButton(!visibleButton);
    formData.title = '';
  }

  const showTitleInput = () => {
    setVisibleTitleInput(!visibleTitleInput);
    setVisibleTitleButton(!visibleTitleButton);
  }

  const createCard = async () => {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/card/create/${boardId}/${listId}`, {
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

  const deleteList = async () => {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/list/delete/${boardId}/${listId}`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true
    }).catch(err => console.log(err))
    setRender(!render);
  }

  const editList = async (event: KeyboardEvent) => {

    if(event.key === 'Enter' && formDataTitle.title !== '') {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/list/edit/${boardId}/${listId}`,{
        title: formDataTitle.title
      },{
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        withCredentials: true
      }).catch(err => console.log(err))
      showTitleInput();
      setRender(!render);
    }
  }

  return (
    <ListGroup key={listId} className={styles.list} title={title}>
      <div>
        <span style={!visibleTitleButton ? {display: 'none'} : {display: 'block'}} onDoubleClick={showTitleInput}>{title}</span>
        <div style={visibleTitleInput ? { display: "flex", flexDirection: 'row', height: '40px', marginBottom: '5px'} : { display: "none" }} className={styles.addInputBlock}>
          <input style={{height: '100%', borderRadius: '5px'}}
                 type={"text"}
                 placeholder={'Title'}
                 name={'title'}
                 value={formDataTitle.title}
                 onChange={handleChangeTitle}
                 onKeyDown={(event) => editList(event)}/>
          <div>
            <CloseButton onClick={showTitleInput}></CloseButton>
          </div>
        </div>
        <DropdownButton className={styles.dropdown} as={ButtonGroup} title="...">
          <Dropdown.Item onClick={deleteList}>Delete</Dropdown.Item>
        </DropdownButton>
      </div>
      {cards.map((item, index) => (
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {(provided) => (
            <ListGroup.Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.item}>
              <CardItem card={item} listTitle={title} boardId={boardId} setRender={setRender} render={render} listActivity={listActivity}/>
            </ListGroup.Item>
          )}
        </Draggable>
      ))}
      <button style={!visibleButton ? {display: "none"}: {display: "block"}} onClick={showInput}>Add a card...</button>
      <div style={visibleInput ? { display: "flex" } : { display: "none" }} className={styles.addInputBlock}>
        <input type={"text"} placeholder={'Title'} name={'title'} value={formData.title} onChange={handleChange} />
        <div>
          <Button type={"reset"} className={styles.addButton} onClick={createCard}>Add</Button>
          <CloseButton onClick={showInput}></CloseButton>
        </div>
      </div>
    </ListGroup>
  );
};

export default ListItem;