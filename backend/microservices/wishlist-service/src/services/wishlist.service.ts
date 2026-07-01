import { KafkaClient } from "../../../shared";
import { Wishlist } from "../models/wishlist.model";

export class WishlistService {
  constructor(
    private readonly kafkaClient: KafkaClient
  ) { }

  async list(userId: string): Promise<Wishlist[]> {
    return await Wishlist.findAll({ where: { userId } });
  }

  async add(userId: string, item: Partial<Wishlist>): Promise<Wishlist> {
    return await Wishlist.create({ ...item, userId } as any);
  }

  async remove(userId: string, productId: number): Promise<boolean> {
    const deleted = await Wishlist.destroy({ where: { userId, productId } });
    return deleted > 0;
  }

  async check(userId: string, productId: number): Promise<boolean> {
    const item = await Wishlist.findOne({ where: { userId, productId } });
    return !!item;
  }
}
