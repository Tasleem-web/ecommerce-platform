import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../../shared';
import { ProductService } from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';

export class ProductController {
  constructor(private readonly service: ProductService) { }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Math.min(Number(req.query.limit ?? 50), 200);
      const offset = Math.max(Number(req.query.offset ?? 0), 0);
      res.json(await this.service.list(limit, offset));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });
      console.log("error", error)
      if (error) throw new BadRequestError('Invalid payload', error.details);
      const product = await this.service.create(value);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false });
      if (error) throw new BadRequestError('Invalid payload', error.details);
      const product = await this.service.update(Number(req.params.id), value);
      res.json(product);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
