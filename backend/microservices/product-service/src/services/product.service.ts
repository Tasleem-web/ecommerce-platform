import { KafkaClient, NotFoundError } from '../../../shared';
import { Product } from '../models/product.model';

export interface productInput {
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

export type UpdateProductInput = Partial<productInput>;

export class ProductService {
  constructor(
    private readonly kafkaClient?: KafkaClient,
    private readonly WishlistModel?: any,
  ) {}

  async list(limit = 50, offset = 0, userId?: string) {
    const { rows, count } = await Product.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    let wishlistedProductIds: number[] = [];
    if (userId && this.WishlistModel) {
      const wishlists = await this.WishlistModel.findAll({
        where: { userId },
        attributes: ['productId'],
      });
      wishlistedProductIds = wishlists.map((w: any) => w.productId);
    }

    const items = rows.map((product) => {
      const plain: any = product.get({ plain: true });
      plain.isWishlisted = wishlistedProductIds.includes(plain.id);
      return plain;
    });

    return { items, total: count };
  }

  async getById(id: number) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError(`Product ${id} not found`);
    return product;
  }

  async create(input: productInput) {
    const product = await Product.create({
      title: input.title,
      category: input.category,
      image: input.image,
      price: input.price,
      description: input.description ?? null,
      stock: input.stock ?? 0,
      rating: input.rating ?? { rate: 0, count: 0 },
    });

    if (this.kafkaClient) {
      try {
        await this.kafkaClient.publish('product.created', {
          id: product.id,
          title: product.title,
          category: product.category,
          price: product.price,
          createdAt: product.createdAt,
        });
      } catch (error) {
        console.warn('Kafka publish failed for product creation:', error);
      }
    }

    return product;
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
