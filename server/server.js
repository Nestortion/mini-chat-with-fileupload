import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'
import server from './schema/index.js'

dotenv.config()

const app = express()

await server.start()

app.use('/graphql', cors(), json(), expressMiddleware(server))

app.listen(process.env.PORT, () => {
  console.log(`listening to ${process.env.PORT}`)
})
