const typeDefs = `
  type User {
    id: Int!
    username: String!
  }

  type Chat {
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

  type Query {
    user(id: Int!): User
    chat(id: Int!): Chat
    group(id: Int!): Group
    userGroup(userId: Int, groupId: Int): UserGroup
    users: [User]
    chats: [Chat]
    groups: [Group]
    userGroups: [UserGroup]
  }

  type Mutation {
    addUser( username: String): User
    addChat( message: String, userId: Int, receiver: Int): Chat
    addGroup( groupName: String): Group
    addUserGroup( groupId: Int): UserGroup
  }
`

export default typeDefs
