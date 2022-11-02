import { DataTypes } from 'sequelize'
import DB from '../config/db.js'

const ChatModel = DB.define(
  'chat',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
)

export { ChatModel }
