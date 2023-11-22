
import axios from "axios";
import {IBoards} from "interfaces/Boards.ts";

export const boardsLoader = async (token: string) => {
  let boards: IBoards[] = []

  await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/board/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  }).then((res
  ) => {
    boards = res.data
  }).catch(err => {
    console.log(err)
  })

  return boards
}