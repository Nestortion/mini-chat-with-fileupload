import { ApolloServer } from '@apollo/server'
import typeDefs from './typeDefs/index.js'
import resolvers from './resolvers/index.js'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

export default server
