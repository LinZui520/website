import { User, Article, Comment, Image, Message, Conversation  } from "@prisma/client";


export interface UserPrisma extends User {
  Articles: Article[]
  Comments:      Comment[]
  Images:        Image[]
  Messages:      Message[]
  Conversations: Conversation[]
}