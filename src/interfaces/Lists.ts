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
  comments: IComments[]
}

export interface ICardEdit {
  title?: string
  description?: string
}

export interface IComments {
  text: string
  createdAt: string
  user: {
    username: string
  }
}

export interface ICommentCreate {
  text: string
}