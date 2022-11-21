import { DataTypes } from 'sequelize'
import DB from '../config/db.js'

const UserChats = DB.define(
  'userchat',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { createdAt: true, updatedAt: false }
)

export { UserChats }
