export interface ILists {
  id: string
  title: string
  cards: ICards[]
}

export interface ICards {
  id: string
  title: string
  description: string
  listId: string
}