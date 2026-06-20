import { NotFoundError } from '../../../shared';
import { Product } from '../models/product.model';

export interface CreateProductInput {
  title: string;
  category: string;
  image: string;
  price: number;
  description?: string;
  stock?: number;
  rating?: {           // Add the optional rating object here
    rate: number;
    count: number;
  };
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
      title: input.title,
      category: input.category,
      image: input.image,
      price: input.price,
      description: input.description ?? null,
      stock: input.stock ?? 0,
      rating: input.rating ?? { rate: 0, count: 0 },
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
