import { DataTypes } from 'sequelize'
import DB from '../config/db.js'
import { GroupModel } from './GroupModel.js'
import { UserModel } from './UserModel.js'

const UserGroups = DB.define(
  'user_group',
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: GroupModel,
        key: 'id',
      },
    },
  },
  { timestamps: false }
)

export { UserGroups }
