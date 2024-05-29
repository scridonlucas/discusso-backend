import { Model, DataTypes, Optional } from 'sequelize';
import database from '../utils/database';
import { DiscussionAttributes } from '../types/discussionType';

const { sequelize } = database;

interface DiscussionCreationAttributes
  extends Optional<DiscussionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Discussion
  extends Model<DiscussionAttributes, DiscussionCreationAttributes>
  implements DiscussionAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Discussion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'discussion',
  }
);

export default Discussion;
