import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

interface Rating {
  rate: number;
  count: number;
}

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare category: string;
  declare image: string;
  declare rating: CreationOptional<Rating | null>;
  declare description: CreationOptional<string | null>;
  declare price: number;
  declare stock: CreationOptional<number>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

export function initProductModel(sequelize: Sequelize): typeof Product {
  Product.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING(190), allowNull: false },
      category: { type: DataTypes.STRING(190), allowNull: false },
      image: { type: DataTypes.STRING(190), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      rating: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: { rate: 0, count: 0 }
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: 'Product', tableName: 'products' },
  );
  return Product;
}
