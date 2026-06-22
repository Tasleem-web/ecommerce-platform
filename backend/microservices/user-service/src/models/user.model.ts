import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare passwordHash: string;
  declare name: string;
  declare roles: CreationOptional<string>;
  declare image: CreationOptional<string | null>;
  declare gender: CreationOptional<string | null>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

export function initUserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      name: { type: DataTypes.STRING(120), allowNull: false },
      // Comma-separated roles to keep schema simple (e.g. "user,admin").
      roles: { type: DataTypes.STRING(120), allowNull: false, defaultValue: 'user' },
      image: { type: DataTypes.STRING(255), allowNull: true },
      gender: { type: DataTypes.STRING(20), allowNull: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'User', tableName: 'users' },
  );
  return User;
}
