import { Model, DataTypes, Optional } from 'sequelize';
import { Gender } from '../types/userTypes';
import database from '../utils/database';
import { UserAttributes } from '../types/userTypes';
const { sequelize } = database;

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public gender!: Gender;
  public birthDate!: string;
  public password!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        is: /^[A-Za-z]+$/,
      },
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        is: /^[A-Za-z]+$/,
      },
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: {
        name: 'uniqueUsername',
        msg: 'Sorry, the username is already taken. Please choose a different username.',
      },
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: {
        name: 'uniqueEmail',
        msg: 'This email address is already in use. Please use a different email address.',
      },
      validate: {
        isEmail: true,
      },
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'user',
  }
);

export default User;
