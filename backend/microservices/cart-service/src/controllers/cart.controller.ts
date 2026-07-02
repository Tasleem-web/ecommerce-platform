import { NextFunction, Request, Response } from 'express';
import { CartService } from "../services/cart.service";


export class CartController {

  constructor(private readonly service: CartService) { }


  list = async (req: any, res: any): Promise<void> => {
    try {
      const userId = req.user.id;
      const carts = await this.service.list(userId);
      res.status(200).json(carts);
    } catch (error) {
      console.error('Error listing carts:', error);
      res.status(500).json({ message: 'Internal server error, list' });
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { productId, quantity } = req.body;
      const { title, category, image, price } = req.body.product;

      const cartItem = await this.service.create({
        userId,
        productId,
        title,
        category,
        image,
        price,
        quantity: quantity || 1
      });

      res.status(201).json(cartItem);
    } catch (error) {
      console.error('Error creating cart item:', error);
      res.status(500).json({ message: 'Internal server error, create' });
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const id = parseInt(req.params.id as string, 10);
      const { quantity } = req.body;

      const cartItem = await this.service.update(id, userId, { quantity });
      res.status(200).json(cartItem);
    } catch (error: any) {
      if (error.message === 'Cart item not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Internal server error, update' });
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const id = parseInt(req.params.id as string, 10);

      const result = await this.service.remove(id, userId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Cart item not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error('Error removing cart item:', error);
      res.status(500).json({ message: 'Internal server error, remove ' });
    }
  }
}