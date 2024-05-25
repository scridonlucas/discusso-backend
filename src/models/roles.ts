import { Model, DataTypes } from 'sequelize';
import database from '../utils/database';

const { sequelize } = database;

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'uniqueRoleName',
        msg: 'This role name is already in use.',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'role',
  }
);

export default Role;
