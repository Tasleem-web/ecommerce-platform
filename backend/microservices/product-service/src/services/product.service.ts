import { NotFoundError } from '../../../shared';
import { Product } from '../models/product.model';

export interface CreateProductInput {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export class ProductService {
  async list(limit = 50, offset = 0) {
    const { rows, count } = await Product.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    return { items: rows, total: count };
  }

  async getById(id: number) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError(`Product ${id} not found`);
    return product;
  }

  async create(input: CreateProductInput) {
    return Product.create({
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      stock: input.stock ?? 0,
    });
  }

  async update(id: number, input: UpdateProductInput) {
    const product = await this.getById(id);
    await product.update(input);
    return product;
  }

  async delete(id: number): Promise<void> {
    const product = await this.getById(id);
    await product.destroy();
  }
}
