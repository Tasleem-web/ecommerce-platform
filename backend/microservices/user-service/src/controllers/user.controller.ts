import { NextFunction, Request, Response } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../shared';
import { UserService } from '../services/user.service';
import { loginSchema, registerSchema } from '../validators/user.validator';
import { uploadImageBuffer, uploadLocalFile } from '../cloudinary';

export class UserController {
  constructor(private readonly service: UserService) { }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
      if (error) throw new BadRequestError('Invalid payload', error.details);
      const user = await this.service.register(
        value.email,
        value.password,
        value.name,
        value.roles,
        value.image,
        value.gender,
      );
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

      if (!req.session) {
        throw new Error('Session store is not initialized');
      }

      req.session.token = result.token;
      req.session.userId = result.user.id;
      req.session.username = result.user.name;
      req.session.role = result.user.roles.includes('admin') ? 'admin' : result.user.roles[0] || '';

      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session) {
      return res.status(200).json({ message: 'No session to destroy' });
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return next(destroyErr);
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  };

  uploadBuffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageData, folder = 'user_profiles' } = req.body as { imageData?: string; folder?: string };
      if (!imageData) throw new BadRequestError('imageData is required');

      const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData;
      const buffer = Buffer.from(base64, 'base64');
      const result = await uploadImageBuffer(buffer, folder);

      res.status(200).json({
        message: 'Upload successful',
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      next(err);
    }
  };

  uploadUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageUrl, folder = 'user_profiles' } = req.body as { imageUrl?: string; folder?: string };
      if (!imageUrl) throw new BadRequestError('imageUrl is required');

      const result = await uploadLocalFile(imageUrl, folder);
      res.status(200).json({
        message: 'Upload successful',
        url: result.secure_url,
        public_id: result.public_id,
      });
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

  getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userName = req.session?.username || 'admin';
      const userToken = req.session?.token || 'no-token';
      res.json({
        message: `Hello ${userName}, here is the secure admin analytics data.`,
        tokenUsed: `Validated active session ending in ...${userToken.toString().slice(-5)}`
      });
    } catch (err) {
      next(err);
    }
  };

}
