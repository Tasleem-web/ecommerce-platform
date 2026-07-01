import { CartService } from "../services/cart.service";


export class CartController {

  constructor(
    private readonly service: CartService
  ) { }


  async list(req: any, res: any): Promise<void> {
    try {
      const userId = req.user.id;
      const carts = await this.service.list(userId);
      res.status(200).json(carts);
    } catch (error) {
      console.error('Error listing carts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

}