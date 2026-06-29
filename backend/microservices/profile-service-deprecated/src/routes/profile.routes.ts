import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";

export function profileRouter(controller: ProfileController): Router {
    const router = Router();
    router.get('/health', controller.health);
    router.post('/register', controller.register);
    router.post('/login', controller.login);

    


    return router;
}