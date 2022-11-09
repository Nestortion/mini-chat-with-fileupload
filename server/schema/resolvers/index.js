import { GroupModel } from '../../models/GroupModel.js'
import DB from '../../config/db.js'
import { UserGroups } from '../../models/UserGroupsModel.js'
import { ChatModel } from '../../models/ChatModel.js'
import { UserModel } from '../../models/UserModel.js'

// Associations
UserModel.hasMany(ChatModel, { foreignKey: { name: 'userId' } })
ChatModel.belongsTo(UserModel, {
  foreignKey: { name: 'userId', allowNull: false },
})

GroupModel.belongsToMany(UserModel, { through: UserGroups })
UserModel.belongsToMany(GroupModel, { through: UserGroups })

GroupModel.hasMany(ChatModel, {
  foreignKey: { name: 'receiver' },
})
ChatModel.belongsTo(GroupModel, {
  foreignKey: { name: 'receiver', allowNull: false },
})

// Model Synchronization
try {
  await DB.sync()
} catch (error) {
  console.log(error)
}

const resolvers = {
  Query: {
    chat(parent, { id }) {
      return ChatModel.findOne({ where: { id } })
    },
    user(parent, { id }) {
      return UserModel.findOne({ where: { id } })
    },
    group(parent, { id }) {
      return GroupModel.findOne({ where: { id } })
    },
    userGroup(parent, { userId, groupId }) {
      if (userId) {
        return UserGroups.findOne({ where: { userId } })
      } else {
        return UserGroups.findOne({ where: { groupId } })
      }
    },
    users() {
      return UserModel.findAll()
    },
    chats() {
      return ChatModel.findAll()
    },
    groups() {
      return GroupModel.findAll()
    },
    userGroups() {
      return UserGroups.findAll()
    },
  },
  Mutation: {
    addUser(parent, { username }) {
      return UserModel.create({ username })
    },
    async addChat(parent, { message, userId, receiver }) {
      const validation = await UserGroups.findOne({
        where: { userId, groupId: receiver },
      })
      if (validation) {
        return ChatModel.create({ message, userId, receiver })
      } else {
        throw new Error()
      }
    },
    addGroup(parent, { groupName }) {
      return GroupModel.create({ groupName })
    },
    addUserGroup(parent, { userId, groupId }) {
      return UserGroups.create({ userId, groupId })
    },
  },
}

export default resolvers
