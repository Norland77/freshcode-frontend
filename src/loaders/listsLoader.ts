
import axios from "axios";
import {ILists} from "interfaces/Lists.ts";
import {IBoards} from "interfaces/Boards.ts";
import {IActivity} from "interfaces/Activity.ts";

export const listsLoader = async (id: string | undefined, token: string) => {
  let lists: ILists[] = [];
  let board: IBoards = {
    id: '',
    title: '',
    userId: ''
  };
  let activity: IActivity[] = [];
  await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/list/all/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  }).then((res
  ) => {
    lists = res.data
  }).catch(err => {
    console.log(err)
  })

  await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/board/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  }).then((res) => {
    board = res.data
  }).catch(err => {
    console.log(err)
  })

  await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/activity/all/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  }).then((res) => {
    activity = res.data
  }).catch(err => {
    console.log(err)
  })

  return {lists, board, activity}
}