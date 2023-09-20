import { Model, DataType } from 'sequelize-typescript';
import database from '../utils/database';

const { sequelize } = database;

class User extends Model {}

User.init(
  {
    id: {
      type: DataType.TEXT,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataType.TEXT,
      allowNull: false,
      validate: {
        is: /^[A-Za-z]+$/,
      },
    },
    lastName: {
      type: DataType.TEXT,
      allowNull: false,
      validate: {
        is: /^[A-Za-z]+$/,
      },
    },
    username: {
      type: DataType.TEXT,
      allowNull: false,
    },
    email: {
      type: DataType.TEXT,
      allowNull: false,
    },
    gender: {
      type: DataType.TEXT,
      allowNull: false,
    },
    birthDate: {
      type: DataType.DATE,
      allowNull: false,
    },
    password: {
      type: DataType.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'user',
  }
);
