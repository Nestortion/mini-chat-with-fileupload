import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} from 'graphql'
import DB from '../config/db.js'
import { ChatModel } from '../models/ChatModel.js'

import { UserModel } from '../models/UserModel.js'

// Associations
UserModel.hasMany(ChatModel, { foreignKey: { name: 'userId' } })
ChatModel.belongsTo(UserModel, {
  foreignKey: { name: 'userId', allowNull: false },
})

// Model Synchronization
try {
  await DB.sync()
} catch (error) {
  console.log(error)
}

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
  }),
})

const ChatType = new GraphQLObjectType({
  name: 'chat',
  fields: () => ({
    id: { type: GraphQLInt },
    message: { type: GraphQLString },
    userId: { type: GraphQLInt },
  }),
})

const query = new GraphQLObjectType({
  name: 'query',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      async resolve(parent, args) {
        return await UserModel.findAll()
      },
    },
    user: {
      type: new GraphQLNonNull(UserType),
      args: { id: { type: GraphQLInt } },
      async resolve(parent, { id }) {
        return await UserModel.findOne({ where: { id } })
      },
    },
    chats: {
      type: new GraphQLNonNull(new GraphQLList(ChatType)),
      async resolve(parent, args) {
        return await ChatModel.findAll()
      },
    },
    chat: {
      type: new GraphQLNonNull(ChatType),
      args: { id: { type: GraphQLInt } },
      async resolve(parent, { id }) {
        return await ChatModel.findOne({ where: { id } })
      },
    },
    userChats: {
      type: new GraphQLNonNull(new GraphQLList(ChatType)),
      args: { userId: { type: GraphQLInt } },
      async resolve(parent, { userId }) {
        return await ChatModel.findAll({ where: { userId } })
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    //insertions
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { username }) {
        return await UserModel.create({ username })
      },
    },
    addChat: {
      type: ChatType,
      args: {
        message: { type: GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, { message, userId }) {
        return await ChatModel.create({ message, userId })
      },
    },
  },
})

const schema = new GraphQLSchema({
  query,
  mutation,
})

export default schema
