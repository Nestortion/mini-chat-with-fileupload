import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'
import server from './config/apolloServer.js'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()

await server.start()

app.use(
  '/graphql',
  graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 10 }),
  cors({ credentials: true, origin: 'http://localhost:5173' }),
  cookieParser(),
  json(),
  expressMiddleware(server, {
    context: ({ req, res }) => {
      // const authorization = req.headers.authorization
      // let data

      // console.log(authorization)
      // if (!authorization) {
      //   data = null
      //   throw new Error('not authenticated')
      // }

      // try {
      //   const token = authorization.split(' ')[1]
      //   const tokendata = jwt.verify(token, process.env.ACCESS_SECRET)
      //   data = tokendata
      // } catch (err) {
      //   data = null
      //   throw new Error('not authenticated')
      // }
      return { req, res }
    },
  })
)

app.listen(process.env.PORT, () => {
  console.log(`listening to ${process.env.PORT}`)
})
