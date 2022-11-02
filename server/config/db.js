import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from 'sequelize'

const DB = new Sequelize('miniChat', 'root', `${process.env.DB_PASS}`, {
  host: 'localhost',
  dialect: 'mysql',
})

try {
  await DB.authenticate()
  console.log('connected to db')
} catch (error) {
  console.error('error', error)
}

export default DB
