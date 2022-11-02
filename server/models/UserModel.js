import DB from '../config/db.js'
import { DataTypes } from 'sequelize'

const UserModel = DB.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { timestamps: false }
)

export { UserModel }
