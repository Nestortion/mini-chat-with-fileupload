import { ApolloServer } from '@apollo/server'
import typeDefs from '../schema/typeDefs/index.js'
import resolvers from '../schema/resolvers/index.js'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false,
})

export default server
