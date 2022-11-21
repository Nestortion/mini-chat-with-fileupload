import DB from '../../config/db.js'
import { Groups } from '../../models/Groups.js'
import { UserGroups } from '../../models/UserGroups.js'
import { UserChats } from '../../models/UserChats.js'
import { Users } from '../../models/Users.js'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import { GroupRoles } from '../../models/GroupRoles.js'
import { UserChatReactions } from '../../models/UserChatReactions.js'
import { UserGroupRoles } from '../../models/UserGroupRoles.js'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { signAccessToken, signRefreshToken } from '../../auth/auth.js'
import { sendRefreshToken } from '../../auth/sendTokens.js'
import { authMiddleware } from '../../auth/middlewares/authMiddleware.js'

// Associations
Users.hasMany(UserChats, { foreignKey: { name: 'userId' } })
UserChats.belongsTo(Users, {
  foreignKey: { name: 'userId', allowNull: false },
})

Groups.hasMany(GroupRoles, { foreignKey: { name: 'groupId' } })
GroupRoles.belongsTo(Groups, {
  foreignKey: { name: 'groupId', allowNull: false },
})

UserChats.hasMany(UserChatReactions, { foreignKey: { name: 'userchat_id' } })
UserChatReactions.belongsTo(UserChats, {
  foreignKey: { name: 'userchat_id', allowNull: false },
})

Groups.hasMany(UserChats, {
  foreignKey: { name: 'receiver' },
})
UserChats.belongsTo(Groups, {
  foreignKey: { name: 'receiver', allowNull: false },
})

Groups.belongsToMany(Users, { through: UserGroups, foreignKey: 'group_id' })
Users.belongsToMany(Groups, { through: UserGroups, foreignKey: 'user_id' })

try {
  await UserGroups.sync()
} catch (error) {}

GroupRoles.belongsToMany(UserGroups, {
  through: UserGroupRoles,
  foreignKey: 'user_group_id',
})
UserGroups.belongsToMany(GroupRoles, {
  through: UserGroupRoles,
  foreignKey: 'group_role_id',
})
// Model Synchronization
try {
  await DB.sync()
} catch (error) {
  console.log(error)
}

const resolvers = {
  Upload: GraphQLUpload,
  AccessLevel: {
    USER: 'USER',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN',
  },
  Query: {
    userChat: (_, { id }) => {
      return UserChats.findOne({ where: { id } })
    },
    user: (_, { id }) => {
      return Users.findOne({ where: { id } })
    },
    group: (_, { id }) => {
      return Groups.findOne({ where: { id } })
    },
    userGroup: (_, { userId, groupId }) => {
      if (userId) {
        return UserGroups.findOne({ where: { userId } })
      } else {
        return UserGroups.findOne({ where: { groupId } })
      }
    },
    users: () => {
      return Users.findAll()
    },
    userChats: () => {
      return UserChats.findAll()
    },
    groups: () => {
      return Groups.findAll()
    },
    userGroups: () => {
      return UserGroups.findAll()
    },
    currentUser: async (_, __, context) => {
      const { req, res, data } = authMiddleware(context)

      const currentUser = await Users.findOne({ where: { id: data.userId } })
      return currentUser
    },
    isLoggedIn: async (_, __, context) => {
      // const { req, res, data } = authMiddleware(context)
      const refreshToken = context.req.cookies['refresh-token']

      const refreshTokenData = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      )

      const refreshTokenUser = await Users.findOne({
        where: { id: refreshTokenData.userId },
      })

      if (refreshTokenUser) return true
      else return false
    },
  },
  Mutation: {
    addUser: async (_, { username, access_level, password }) => {
      return Users.create({ username, access_level, password })
    },
    addUserChat: async (_, { file, message, userId, receiver }, context) => {
      const { req, res } = authMiddleware(context)

      const validation = await UserGroups.findOne({
        where: { user_id: userId, group_id: receiver },
      })
      if (validation) {
        if (file) {
          const { createReadStream, filename } = await file
          let newFileName = `dnca${filename}`
          await new Promise((res) =>
            createReadStream()
              .pipe(
                createWriteStream(
                  path.join('__dirname', '../images', newFileName)
                )
              )
              .on('close', res)
          )
          return UserChats.create({ message: newFileName, userId, receiver })
        } else {
          if (message !== '') {
          }
          return UserChats.create({ message, userId, receiver })
        }
      } else {
        throw new GraphQLError(
          `userId ${userId} does not belong to groupId ${receiver}`
        )
      }
    },
    addGroup: (_, { groupName }) => {
      return Groups.create({ groupName })
    },
    addUserGroup: (_, { userId, groupId }) => {
      return UserGroups.create({ user_id: userId, group_id: groupId })
    },
    addGroupRole: async (_, { roleName, emoji, description, groupId }) => {
      const validation = await GroupRoles.findOne({
        where: { roleName, groupId },
      })

      if (!validation) {
        return GroupRoles.create({ roleName, emoji, description, groupId })
      } else {
        throw new GraphQLError('role already exist')
      }
    },
    addUserGroupRole: (_, { userGroupId, groupRoleId }) => {
      return UserGroupRoles.create({
        user_group_id: userGroupId,
        group_role_id: groupRoleId,
      })
    },
    addUserChatReaction: (_, { reaction, count, userChatId }) => {
      return UserChatReactions.create({
        reaction,
        count,
        userchat_id: userChatId,
      })
    },
    login: async (_, { username, password }, context) => {
      console.log(context.req.headers.authorization)
      const user = await Users.findOne({
        where: { username, password },
      })
      if (!user) {
        throw new GraphQLError('Username or password does not match')
      }

      sendRefreshToken(context.res, signRefreshToken(user))
      return { accessToken: signAccessToken(user) }
    },
    refreshAccessToken: async (_, __, { req, res }) => {
      const token = req.cookies['refresh-token']
      // console.log(token)

      if (!token) {
        throw new GraphQLError('Refresh Token does not exist')
      }

      let data
      try {
        data = jwt.verify(token, process.env.REFRESH_SECRET)
      } catch (err) {
        throw new GraphQLError('Refresh Token does not exist')
      }

      const user = await Users.findOne({ where: { id: data.userId } })

      if (!user) {
        throw new GraphQLError('User does not exist')
      }

      if (user.tokenVersion !== data.refreshCount) {
        throw new GraphQLError('Token Version does not match')
      }
      sendRefreshToken(res, signRefreshToken(user))

      return { accessToken: signAccessToken(user) }
    },
    revokeRefreshToken: async (_, { userId }, context) => {
      const { req, res, data } = authMiddleware(context)

      const increment = await Users.increment(
        { tokenVersion: 1 },
        { where: { id: userId } }
      )

      if (increment) return true
      else return false
    },
  },
}

export default resolvers
