import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import schema from './schema/schema.js'

dotenv.config()

const app = express()

app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on PORT ${process.env.PORT}`)
})
