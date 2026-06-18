import { NextFunction, Request, Response } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../shared';
import { UserService } from '../services/user.service';
import { loginSchema, registerSchema } from '../validators/user.validator';

export class UserController {
  constructor(private readonly service: UserService) { }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
      if (error) throw new BadRequestError('Invalid payload', error.details);
      const user = await this.service.register(value.email, value.password, value.name);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
      if (error) throw new BadRequestError('Invalid payload', error.details);
      const result = await this.service.login(value.email, value.password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const user = await this.service.findById(Number(req.user.sub));
      if (!user) throw new NotFoundError('User not found');
      res.json(this.service.toDto(user));
    } catch (err) {
      next(err);
    }
  };

  getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    console.log('Fetching all users...');
    try {
      const users = await this.service.findAll();
      res.json(users.map(u => this.service.toDto(u)));
    } catch (err) {
      next(err);
    }
  };

}
