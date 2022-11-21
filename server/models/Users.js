import DB from '../config/db.js'
import { DataTypes } from 'sequelize'

const Users = DB.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    access_level: {
      type: DataTypes.ENUM('USER', 'MODERATOR', 'ADMIN'),
      allowNull: false,
      defaultValue: 'USER',
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { timestamps: false }
)

export { Users }
