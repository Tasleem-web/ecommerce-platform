import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/profile.service";
import { loginSchema, registerSchema } from "../validators/profile.validator";
import { BadRequestError } from "../../../shared";
import { STATUS_CODES } from "node:http";
import { profileConfig } from "../config";


export class ProfileController {

    constructor(private profileService: ProfileService) { }

    register = async (request: Request, response: Response, next: NextFunction) => {

        try {
            const { error, value } = registerSchema.validate(request.body, { abortEarly: false });
            if (error) throw new BadRequestError(`Invalid payload`, error.details);
            const profile = await this.profileService.register(value.email, value.password, value.name, value.roles);
            response.status(201).json(profile)
        } catch (error) {
            next(error)
        }
    }
    login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { error, value } = loginSchema.validate(request.body, { abortEarly: false });
            if (error) throw new BadRequestError('Invalid payload', error.details);

            const result = await this.profileService.login(value.email, value.password);
            response.status(200).json(result);

        } catch (error) {
            next(error)
        }
    }

    health = (request: Request, response: Response, next: NextFunction) => {
        const result = {
            service: profileConfig.serviceName,
            status: STATUS_CODES[200] as 'ok' | 'degraded',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            dependencies: {
                database: STATUS_CODES[200] as 'ok' | 'down'
            }
        }
        response.status(result.status === 'ok' ? 200 : 503).json(result);
    }

}