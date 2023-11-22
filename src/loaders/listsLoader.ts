
import axios from "axios";
import {ILists} from "interfaces/Lists.ts";

export const listsLoader = async (id: string | undefined, token: string) => {
  let lists: ILists[] = []

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

  return lists
}