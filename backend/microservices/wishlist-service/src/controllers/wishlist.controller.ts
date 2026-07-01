import { WishlistService } from "../services/wishlist.service";

export class WishlistController {

  constructor(
    private readonly service: WishlistService
  ) { }

  list = async (req: any, res: any): Promise<void> => {
    try {
      const userId = req.user.id;
      const items = await this.service.list(userId);
      res.status(200).json(items);
    } catch (error) {
      console.error('Error listing wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  add = async (req: any, res: any): Promise<void> => {
    try {
      const userId = req.user.id;
      console.log(`Adding item to wishlist for user: ${userId}`, req.body);
      const item = await this.service.add(userId, req.body);
      console.log(`Added item to wishlist for user: ${userId}`, item);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  remove = async (req: any, res: any): Promise<void> => {
    try {
      const userId = req.user.id;
      const productId = Number(req.params.productId);
      const deleted = await this.service.remove(userId, productId);
      if (deleted) {
        res.status(200).json({ message: 'Item removed from wishlist' });
      } else {
        res.status(404).json({ message: 'Item not found in wishlist' });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  check = async (req: any, res: any): Promise<void> => {
    try {
      const userId = req.user.id;
      const productId = Number(req.params.productId);
      const exists = await this.service.check(userId, productId);
      res.status(200).json({ isWishlisted: exists });
    } catch (error) {
      console.error('Error checking wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
