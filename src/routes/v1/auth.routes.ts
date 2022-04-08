import { Router } from "express";
import { login, logout } from "../../controllers/auth.controllers";

const router = Router();

router.get('/logout', logout)

router.post('/login', login)

export default router