import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Wishlist extends Model<InferAttributes<Wishlist>, InferCreationAttributes<Wishlist>> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare productId: number;
  declare title: string;
  declare category: string;
  declare image: string;
  declare price: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

export function initWishlistModel(sequelize: Sequelize): typeof Wishlist {
  Wishlist.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.STRING(190), allowNull: false },
      productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      title: { type: DataTypes.STRING(190), allowNull: false },
      category: { type: DataTypes.STRING(190), allowNull: false },
      image: { type: DataTypes.STRING(190), allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'Wishlist', tableName: 'wishlists' },
  );
  return Wishlist;
}