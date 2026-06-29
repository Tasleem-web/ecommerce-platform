import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";



export class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare name: string;
  declare passwordHash: string;
  declare roles: CreationOptional<string>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

export function initProfileModel(sequelize: Sequelize): typeof Profile {
  Profile.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      name: { type: DataTypes.STRING(120), allowNull: false },
      roles: { type: DataTypes.STRING(120), allowNull: false, defaultValue: 'profile' },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    { sequelize, modelName: 'Profile', tableName: 'profiles' }
  );
  return Profile;
}