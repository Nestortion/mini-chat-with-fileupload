const typeDefs = `

  scalar Upload

  type User {
    id: Int!
    username: String!
    access_level: AccessLevel!
    password: String!
    tokenVersion: String!
  }

  enum AccessLevel {
    USER
    MODERATOR
    ADMIN
  }

  type UserChat {
    id: Int!
    message: String!
    userId: Int!
    receiver: Int!
  }

  type Group {
    id: Int!
    groupName: String!
  }

  type UserGroup {
    userId: Int!
    groupId: Int!
  }

  type GroupRole{
    roleName: String!
    emoji: String!
    description: String!
    groupId: String!
  }

  type UserGroupRole{
    userGroupId: Int!
    groupRoleId: Int!
  }

  type UserChatReaction{
    reaction: String!
    count: Int!
    userChatId: Int!
  }

  type AccessToken{
    accessToken: String!
  }


  type Query {
    user(id: Int!): User
    userChat(id: Int!): UserChat
    group(id: Int!): Group
    userGroup(userId: Int, groupId: Int): UserGroup
    users: [User]
    userChats: [UserChat]
    groups: [Group]
    userGroups: [UserGroup]
    groupRoles: [GroupRole]
    userGroupRoles: [UserGroupRole]
    userChatReactions: [UserChatReaction]
    currentUser: User
    isLoggedIn: Boolean
  }

  type Mutation {
    addUser( username: String, access_level: AccessLevel, password: String): User
    addUserChat( file: Upload, message: String, userId: Int, receiver: Int): UserChat
    addGroup( groupName: String): Group
    addUserGroup( userId:Int, groupId: Int): UserGroup
    addGroupRole( roleName: String, emoji: String, description: String, groupId: Int): GroupRole
    addUserGroupRole( userGroupId: Int, groupRoleId: Int): UserGroupRole
    addUserChatReaction ( reaction: String, count: Int, userChatId: Int): UserChatReaction
    login(username: String!, password: String!): AccessToken
    refreshAccessToken : AccessToken
    revokeRefreshToken(userId:Int!) : Boolean
  }

`

export default typeDefs
