import bcrypt from 'bcrypt';
import { ConflictError, signJwt, UnauthorizedError } from '../../../shared';
import { User } from '../models/user.model';

const BCRYPT_ROUNDS = 10;

export class UserService {
  async register(email: string, password: string, name: string, roles: string[] = ['user'], image?: string, gender?: string) {
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const cloudinaryImagePath = process.env.CLOUDINARY_UPLOAD_FOLDER || 'https://res.cloudinary.com/tasleem/image/upload/v1782056301/';
    const imageValue =
      gender === 'male'
        ? cloudinaryImagePath + 'male_user_icon_voqiwc.png'
        : (gender === 'female' ? cloudinaryImagePath + 'female_user_icon_r9nxxh.png' : null);
    const user = await User.create({ email, passwordHash, name, roles: roles.join(','), image: image || imageValue, gender });
    console.log('Registered user:', user.toJSON());
    return this.toDto(user);
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid credentials');

    const token = signJwt({
      sub: String(user.id),
      email: user.email,
      roles: user.roles.split(','),
    });
    return { token, user: this.toDto(user) };
  }

  async findById(id: number) {
    return User.findByPk(id);
  }

  async findAll() {
    return User.findAll();
  }


  toDto(u: User) {
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      roles: u.roles.split(','),
      createdAt: u.createdAt,
      image: u.image,
      gender: u.gender,
    };
  }
}
