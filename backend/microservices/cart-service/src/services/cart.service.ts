import { KafkaClient } from "../../../shared";
import { Cart } from "../models/cart.model";


export class CartService {
  constructor(
    private readonly kafkaClient: KafkaClient
  ) { }

  async list(userId: string) {
    return await Cart.findAll({ where: { userId } });
  }

  async create(data: {
    userId: string;
    productId: number;
    title: string;
    category: string;
    image: string;
    price: number;
    quantity: number;
  }) {
    return await Cart.create(data);
  }

  async update(id: number, userId: string, data: { quantity: number }) {
    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    cartItem.quantity = data.quantity;
    await cartItem.save();
    return cartItem;
  }

  async remove(id: number, userId: string) {
    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    await cartItem.destroy();
    return { message: 'Cart item removed' };
  }
}