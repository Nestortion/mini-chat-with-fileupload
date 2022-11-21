import { DataTypes } from 'sequelize'
import DB from '../config/db.js'

const GroupRoles = DB.define(
  'group_role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emoji: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
)

export { GroupRoles }
