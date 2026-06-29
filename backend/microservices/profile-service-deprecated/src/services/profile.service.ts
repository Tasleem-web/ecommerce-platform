import { ConflictError, signJwt, UnauthorizedError } from "../../../shared";
import { Profile } from "../models/profile.model";
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;

export class ProfileService {

    async createFromRegistration(event: { email: string; name: string; roles?: string; id?: number }) {
        const existing = await Profile.findOne({ where: { email: event.email } });
        if (existing) return existing;

        const passwordHash = await bcrypt.hash(`external-${event.email}-${event.id ?? 'registration'}`, BCRYPT_ROUNDS);
        const roleString = event.roles?.trim() || 'profile';

        const profile = await Profile.create({
            email: event.email,
            passwordHash,
            name: event.name,
            roles: roleString,
        });

        return profile;
    }

    async register(email: string, password: string, name: string, roles?: string | string[]) {
        // first check existing profile
        const existing = await Profile.findOne({ where: { email } });
        if (existing) throw new ConflictError('Profile already exist.');

        // password hash
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const roleString = Array.isArray(roles)
            ? roles.join(',')
            : roles?.trim() || 'profile';

        const profile = await Profile.create({ email, passwordHash, name, roles: roleString });
        return this.toDto(profile);
    }

    async login(email: string, password: string) {
        // find profile
        const profile = await Profile.findOne({ where: { email } });
        if (!profile) throw new UnauthorizedError('Invalid credentials.');

        // if found compare password
        const ok = await bcrypt.compare(password, profile.passwordHash);
        console.log('Password match:', ok);
        if (!ok) throw new UnauthorizedError('Invalid credentials');

        // generate token
        const token = signJwt({
            sub: String(profile.id),
            email: profile.email,
            roles: profile.roles.split(',')
        });

        return { token, profile: this.toDto(profile) };

    }

    async findById() { }

    async findAll() { }

    toDto(profile: Profile) {

        return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            roles: profile.roles.split(','),
            createdAt: profile.createdAt
        }
    }
}