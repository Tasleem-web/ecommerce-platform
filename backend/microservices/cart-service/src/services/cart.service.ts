import { KafkaClient } from "../../../shared";
import { Cart } from "../models/cart.model";


export class CartService {
  constructor(
    private readonly kafkaClient: KafkaClient
  ) { }

  async list(userId: string) {
    return await Cart.findAll({ where: { userId } });
  }
}
