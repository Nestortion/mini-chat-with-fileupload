import { DataTypes } from 'sequelize'
import DB from '../config/db.js'

const GroupModel = DB.define(
  'group',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: false }
)

export { GroupModel }
