import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare productId: number;
  declare title: string;
  declare category: string;
  declare image: string;
  declare price: number;
  declare quantity: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

export function initCartModel(sequelize: Sequelize): typeof Cart {
  Cart.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.STRING(190), allowNull: false },
      productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      title: { type: DataTypes.STRING(190), allowNull: false },
      category: { type: DataTypes.STRING(190), allowNull: false },
      image: { type: DataTypes.STRING(190), allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'Cart', tableName: 'carts' },
  );
  return Cart;
}
